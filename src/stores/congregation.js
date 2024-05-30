import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCongregationStore = defineStore('congregation', () => {

    // {
    //     name: "Sign Language Congregation - Tacloban City",
    //     publishers: [
    //         { name: 'Jezreel Tan', roles: ['elder'] },
    //         { name: 'Alberto Balleres', roles: ['ms'] },
    //         { name: 'Keno Dagalea', roles: ['elder', 'secretary'] },
    //         { name: 'Meriam Dy', roles: ['rp'] },
    //     ],
    // }
    const LOCAL_KEY = "congregation"
    const congregation = ref({});

    const congName = computed(() => {
        return congregation.value?.name ?? null
    })

    const publisherNames = computed(() => {
        const pubs = congregation.value?.publishers ?? []
        const names = pubs.map(p => p['name']);
        return names.sort();
    });

    const publishers = computed(() => {
        const pubs = congregation.value?.publishers ?? [].slice();
        const sorted = pubs.sort((p1, p2) => {
            const name1 = p1['name']
            const name2 = p2['name']

            return name1.localeCompare(name2)
        })
        return sorted;
    });

    const eldersMs = computed(() => {
        const pubs = publishers.value
        return pubs.filter(p => p.roles && (p.roles.includes('elder') || p.roles.includes('ms')));
    })

    async function retrieveLocal() {
        const storedCongInfo = localStorage.getItem(LOCAL_KEY);

        if (storedCongInfo) {
            const parsed = JSON.parse(storedCongInfo)
            congregation.value = parsed
        }
    }

    function storeToLocal() {
        const storable = JSON.stringify(congregation.value)
        localStorage.setItem(LOCAL_KEY, storable)
    }

    return { congregation, congName, publisherNames, publishers, eldersMs, retrieveLocal, storeToLocal }
})