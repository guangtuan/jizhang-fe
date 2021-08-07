import {
    assoc,
    assocPath,
    compose,
    flatten,
    map,
    prop,
    nthArg,
    filter,
    propSatisfies,
    gt,
    __,
} from 'ramda'

import { get, post, put, del } from '../core/request'
import { subjectLevel } from '../core/def'

const defaultForm = () => ({
    id: undefined,
    name: undefined,
    description: undefined,
    parentId: undefined,
    level: subjectLevel.BIG,
})

const gt0 = gt(__, 0)
const removeChildren = assoc('children', [])
const validSubject = propSatisfies(gt0, 'id')
const flatedChildren = compose(flatten, map(prop('children')))
const justParents = compose(filter(validSubject), map(removeChildren))

export const subjects = {
    name: 'subjects',
    state: {
        subjectTree: [],
        display: [],
        form: defaultForm(),
        flatedChildren: [],
        justParents: [],
        creating: false,
        editing: false,
    },
    reducers: {
        hideDialog: compose(
            assoc('creating', false),
            assoc('editing', false),
            nthArg(0),
        ),
        showCreateDialog: compose(
            assoc('creating', true),
            nthArg(0),
        ),
        showEditingDialog: compose(
            assoc('editing', true),
            nthArg(0),
        ),
        clearForm: (state, payload) => {
            return assoc('form', defaultForm())(state)
        },
        changeProperty: (state, payload) => {
            const apply = assocPath(['form', payload.key], payload.val)
            return apply(state)
        },
        setSubjectTree: (state, payload) => {
            return assoc('subjectTree', payload)(state)
        },
        setFlatedChildren: (state, payload) => {
            return assoc('flatedChildren', payload)(state)
        },
        setParents: (state, payload) => {
            return assoc('justParents', payload)(state)
        },
    },
    effects: (dispatch) => ({
        load: async (payload, rootState) => {
            const subjectTree = await get({
                path: 'api/subjects',
                data: payload,
            })
            dispatch.subjects.setSubjectTree(subjectTree)
            dispatch.subjects.setFlatedChildren(flatedChildren(subjectTree))
            dispatch.subjects.setParents(justParents(subjectTree))
        },
        create: async (payload, rootState) => {
            await post({
                path: 'api/subjects',
                data: payload,
            })
            return true
        },
        edit: async (payload, rootState) => {
            await put({
                path: `api/subjects/${payload.id}`,
                data: payload.pack,
            })
            return true
        },
        del: async (payload, rootState) => {
            return del({
                path: `api/subjects/${payload}`,
            })
        },
    }),
}
