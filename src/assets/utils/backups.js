import { createPinia, setActivePinia } from 'pinia';
import { useAssembliesStore } from "@/stores/assemblies";
import { useCongregationStore } from '@/stores/congregation';
import { useAssignmentsStore } from '@/stores/assignments';
import { useCoVisitStore } from '@/stores/covisits';
import { useFileStore } from '@/stores/files';


const pinia = createPinia();
setActivePinia(pinia);

const LOCAL_KEYS = {
    cong: "congregation",
    assignments: "assignments",
    khmsEvents: "khms-events",
    khmsCoVisits: "khms-co-visits",
    visitDetails: "khms-co-visits-details",
    eventDetails: "khms-events-details",
    mwbTemplate: "mwb-template",
}

const backup = {
    async create() {
        const content = JSON.stringify(await compose())
        downloadJSONAsText(content)
    },
    async restore(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const jsonStr = e.target.result;
                    const jsonObj = JSON.parse(jsonStr);
                    restore(jsonObj);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    }
}

export default backup;

async function compose() {
    return {
        cong: JSON.parse(localStorage.getItem(LOCAL_KEYS.cong)),
        assignments: JSON.parse(localStorage.getItem(LOCAL_KEYS.assignments)),
        khmsEvents: JSON.parse(localStorage.getItem(LOCAL_KEYS.khmsEvents)),
        khmsCoVisits: JSON.parse(localStorage.getItem(LOCAL_KEYS.khmsCoVisits)),
        visitDetails: JSON.parse(localStorage.getItem(LOCAL_KEYS.visitDetails)),
        eventDetails: JSON.parse(localStorage.getItem(LOCAL_KEYS.eventDetails)),
        mwbTemplate: localStorage.getItem(LOCAL_KEYS.mwbTemplate),
    }
}

async function restore(data) {
    const res = JSON.parse(data);
    localStorage.setItem(LOCAL_KEYS.cong, JSON.stringify(res.cong))
    localStorage.setItem(LOCAL_KEYS.assignments, JSON.stringify(res.assignments))
    localStorage.setItem(LOCAL_KEYS.khmsEvents, JSON.stringify(res.khmsEvents))
    localStorage.setItem(LOCAL_KEYS.khmsCoVisits, JSON.stringify(res.khmsCoVisits))
    localStorage.setItem(LOCAL_KEYS.visitDetails, JSON.stringify(res.visitDetails))
    localStorage.setItem(LOCAL_KEYS.eventDetails, JSON.stringify(res.eventDetails))
    localStorage.setItem(LOCAL_KEYS.mwbTemplate, res.mwbTemplate)

    const assemblies = useAssembliesStore();
    const congregation = useCongregationStore();
    const assignments = useAssignmentsStore();
    const eventDetails = useCoVisitStore();
    const fileStore = useFileStore()

    assemblies.retrieveLocal();
    congregation.retrieveLocal();
    assignments.retrieveLocal();
    eventDetails.retrieveLocal();
    fileStore.retrieveLocal();
}

function downloadJSONAsText(jsonObject) {
    const jsonString = JSON.stringify(jsonObject, null, 2);
    const blob = new Blob([jsonString], { type: 'text/plain' });
    const link = document.createElement('a');

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const fileName = `khms-backup-${year}-${month}-${day}-${hours}-${minutes}-${seconds}.txt`;

    link.download = fileName;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}