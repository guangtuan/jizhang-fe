import { assoc, assocPath, pipe } from 'ramda'

const defaultForm = () => ({
    id: -1,
    type: '',
    userId: -1,
    name: '',
    initAmount: 0,
    description: '',
})

export const accountEdit = {
    state: {
        dialogVisibility: false,
        creating: false,
        editing: false,
        form: defaultForm(),
    },
    reducers: {
        changeProperty: (state, payload) => {
            const apply = assocPath(['form', payload.key], payload.val)
            return apply(state)
        },
        hideDialog: (state, payload) => {
            const apply = pipe(
                assoc('dialogVisibility', false),
                assoc('creating', false),
                assoc('editing', false),
            )
            return apply(state)
        },
        showEditDialog: (state, payload) => {
            const apply = pipe(
                assoc('dialogVisibility', true),
                assoc('editing', true),
            )
            return apply(state)
        },
        showCreateDialog: (state, payload) => {
            const apply = pipe(
                assoc('dialogVisibility', true),
                assoc('creating', true),
            )
            return apply(state)
        },
        clearForm: (state, payload) => {
            return assoc('form', defaultForm())(state)
        },
        setForm: (state, payload) => {
            return assoc('form', payload)(state)
        },
    },
    effects: (dispatch) => ({

    }),
}
