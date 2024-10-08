<script lang="ts" setup>
    import { computed, ref } from 'vue';
    import duplicateCard from '../../helpers/duplicate-card.js';
    import { Card } from '../../typings/card.js';
    import { templatesStore } from '../../stores/templates-store.js';
    import CardComponentEditor from './CardComponentEditor/CardComponentEditor.vue';
    import { cardStore } from '../../stores/cards-store.js';

    const availableTags = ref<string[]>(cardStore.getAllCardTags())

    const model = defineModel<Card>({ default: duplicateCard(undefined) })
    const variableNames = computed(() => {
        const variables: string[] = []
        for (const templateName of [...model.value.frontsideTemplates, ...model.value.backsideTemplates]) {
            const template = templatesStore.templates[templateName]
            for (const variable of template.getVariables()) {
                if (!variables.includes(variable)) {
                    variables.push(variable)
                }
            }
        }
        return variables
    }
    )

    function createValue(val: string, done: (item: string, mode: string) => void) {
        if (val.length > 0) {
            if (!availableTags.value.includes(val)) {
                availableTags.value.push(val)
            }
            done(val, 'toggle')
        }
    }

    function filterFn(val: string, update: (a: () => void) => void) {
        update(() => {
            if (val === '') {
                availableTags.value = cardStore.getAllCardTags()
            }
            else {
                const needle = val.toLowerCase()
                availableTags.value = cardStore.getAllCardTags().filter(
                    v => v.toLowerCase().indexOf(needle) > -1
                )
            }
        })
    }


</script>
<template>
    <q-scroll-area class="h-full">
        <q-card class="p-2 my-2">
            <div>General</div>
            <name-field class="mb-2" v-model="model.name" />
            <q-select use-input @filter="filterFn" @new-value="createValue" class="col-auto tags" dense outlined
                label="Tags" v-model="model.tags" multiple :options="availableTags" use-chips stack-label />
        </q-card>
        <q-card class="p-2 my-2" v-if="variableNames.length > 0">
            <div>Variables</div>
            <AutocompleteInput class="mb-2" :includeFonts="true" :includeImages="true"
                v-model="model.variables[variable]" :label="variable" v-for="variable in variableNames"
                :key="variable" />
        </q-card>
        <q-card class="p-2 my-2">
            <CardComponentEditor label="Frontside templates" v-model="model.frontsideTemplates"
                :card-name="model.name" />
        </q-card>
        <q-card class="p-2 my-2">
            <CardComponentEditor label="Backside templates" v-model="model.backsideTemplates" :card-name="model.name" />
        </q-card>
    </q-scroll-area>
</template>
