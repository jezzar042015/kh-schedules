<template>
    <div class="s140-grid-col2 s140-part-item">
        <div class="s140-grid-titles">
            <span v-show="part.time" class="s140-runtime">{{ runTime }}</span>
            <span v-show="part.time">{{ part.title }} {{ timeLimit }}</span>
        </div>
        <div class="assignee" v-show="canSelectPerson" @click.stop="showSelector">
            <div :class="assignClasses">
                <span class="s140-part-label" v-show="part.label">{{ part.label }}:</span>
                {{ displayAssignee }}
            </div>
            <PublisherSelector v-if="selector.show" :part="part" :me="selector" :assignee="partAssignedTo" />
        </div>
    </div>
</template>

<script setup>
    import { useAssignmentsStore } from '@/stores/assignments';
    import { computed, ref } from 'vue';
    import { useCongregationStore } from '@/stores/congregation';
    import PublisherSelector from '../template-psp/PublisherSelector.vue';


    const assignmentStore = useAssignmentsStore();
    const congStore = useCongregationStore();

    const props = defineProps({
        part: Object
    })

    const selector = ref({
        show: false
    })

    const displayAssignee = computed(() => {
        if (!props.part.isVisit) {
            const partid = props.part.id
            const assigned = assignmentStore.getAssignments[partid];
            return assigned ?? 'Not Assigned!';
        } else {
            return props.part.co
        }
    })

    const canSelectPerson = computed(() => {
        return props.part.roles.length > 0
    })

    const assignClasses = computed(() => {
        return [
            's140-person', 'relative',
            { 'faded': displayAssignee.value == 'Not Assigned!' }
        ]
    })

    const timeLimit = computed(() => {
        if (!props.part.time) return null
        if (props.part.showNoTime) return null
        return `(${props.part.time} min.)`
    })

    const partAssignedTo = computed(() => {
        const partid = props.part.id
        const assigned = assignmentStore.getAssignments[partid];
        return assigned
    })

    const runTime = computed(() => {
        const startTime = congStore.congregation.midweekTime ?? '06:00'
        return displayTime(startTime, props.part.runtime)
    })

    function showSelector() {
        selector.value.show = true
    }

    function displayTime(startingTime, minutesToAdd) {
        const [startHours, startMinutes] = startingTime.split(':').map(Number);
        let totalMinutes = startHours * 60 + startMinutes + minutesToAdd;
        let newHours = Math.floor(totalMinutes / 60) % 24;
        const newMinutes = totalMinutes % 60;

        if (newHours === 0) {
            newHours = 12;
        } else if (newHours > 12) {
            newHours -= 12;
        }

        const formattedHours = newHours.toString().padStart(2, '0');
        const formattedMinutes = newMinutes.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}`;
    }


</script>
