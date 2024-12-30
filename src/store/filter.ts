
import baseFilter from '../assets/data/defaultFilter.json'
import { getLS, setLS } from '../utils.ts'
import { defineStore } from 'pinia'

const lastFilter = getLS('lastFilter')

const rules = [...(lastFilter ? lastFilter : baseFilter)]
export const useFilterStore = defineStore({
    id: 'filter',
    state: () => ({ rules }),
    actions: {
        addRule(rule) {
            this.rules.push(rule)
        },
        updateRule(rule) {
            const i = this.rules.findIndex(it => it.id === rule.id)
            this.rules.splice(i, 1, rule)
        },
        moveUpRule(rule) {
            const i = this.rules.findIndex(it => it.id === rule.id)
            this.rules.splice(i, 1)
            this.rules.splice(i-1, 0, rule)
        },
        moveDownRule(rule) {
            const i = this.rules.findIndex(it => it.id === rule.id)
            this.rules.splice(i, 1)
            this.rules.splice(i+1, 0, rule)
        }
    }
})