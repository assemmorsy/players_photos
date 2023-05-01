<template>
    <div v-if="board && records">
        <div class="mt-3 ms-3">
            <h4>ادوات التحكم بالتسجيل </h4>

            <div class="m-3 d-flex justify-content-center align-items-center"
                v-if="records[board.record.id] && (board.record.state === 'running')">
                <label for="name" class="form-label d-inline-block me-4">اسم التسجيل</label>
                <input type="text" class="form-control d-inline-block w-75" name="name" id="name" placeholder="اسم التسجيل"
                    v-model="records[board.record.id].name" required />
            </div>

            <div class="actions mt-3 ms-2">
                <button class="btn btn-success mx-2" v-if="board.record.state === 'finished'"
                    @click.prevent="handleStartRecord">
                    ابدا التسجيل
                    <i class="bi bi-record-circle"></i>
                </button>

                <button class="btn btn-danger mx-2" v-if="board.record.state === 'running'"
                    @click.prevent="handleEndRecord">
                    انهاء التسجيل
                    <i class="bi bi-stop-circle"></i>
                </button>
            </div>
        </div>
        <hr>
        <div class="mt-3 ms-3">
            <h4>البحث عن تسجيل</h4>
            <div class="mt-2">
                <label for="search" class="form-label d-inline-block me-2 fs-3">بحث</label>
                <input type="text" v-model="search" class="form-control d-inline-block" id="search" placeholder="كلمة البحث"
                    style="width: 70%" />
            </div>
            <table v-if="filteredRecords.length > 0" class="table table-striped  mt-3" style="width: 98%">
                <thead>
                    <tr>
                        <th scope="col">تاريخ التسجيل </th>
                        <th scope="col">اسم التسجيل</th>
                        <th scope="col">الادوات</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="rec in filteredRecords" :key="rec.id">
                        <th scope="row">{{ (new Date(rec.createdAt.seconds * 1000)).toLocaleDateString() }}</th>
                        <td>{{ rec.name }}</td>
                        <td>
                            <div v-if="rec.id !== board.record.id">
                                <button class="btn btn-primary mx-1 p-1" @click.prevent="handleCopyRecord(rec.id)">
                                    <i class=" bi bi-clipboard"></i>
                                </button>
                                <button class="btn btn-danger mx-1 p-1" @click.ctrl.prevent="handleDeleteRecord(rec.id)">
                                    <i class="bi bi-trash3"></i>
                                </button>
                            </div>
                            <div v-else>
                                تحت التسجيل
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import useDocument from "@/composables/useDocument";
import useCollection from "@/composables/useCollection.js";
import { ref, computed } from "vue"
const props = defineProps(["players", "board", "ENV", "sponcers", "records"])

const { error, isPending, deleteDoc, updateDoc } = useDocument("board");
const { error: errorRecord, isPending: isPendingRecord, deleteDoc: deleteRecord, updateDoc: updateRecord } = useDocument("records");
const {
    error: saveDataError,
    loading: saveDataloading,
    addDoc,
} = useCollection("records");

const search = ref("")
const filteredRecords = computed(() => {
    let res = []
    for (const key in props.records) {
        if (props.records[key].name.toLowerCase().includes(search.value.toLowerCase()))
            res.push(props.records[key])
    }
    return res
})
const WiNNING_SCORE = 152;

const teamsNames = computed(() => {
    if (props.board && props.players) {
        if (props.board.namesControl === "auto") {
            let names = {};
            if (props.board.team1.top && props.board.team1.bottom) {
                names.team1 = `${props.players[props.board.team1.top].name} | ${props.players[props.board.team1.bottom].name
                    }`;
            } else if (!props.board.team1.top && props.board.team1.bottom) {
                names.team1 = `${props.players[props.board.team1.bottom].name}`;
            } else if (props.board.team1.top && !props.board.team1.bottom) {
                names.team1 = `${props.players[props.board.team1.top].name}`;
            } else if (!props.board.team1.top && !props.board.team1.bottom) {
                names.team1 = `لم يتم تحديد لاعبى الفريق`;
            }

            if (props.board.team2.left && props.board.team2.right) {
                names.team2 = `${props.players[props.board.team2.right].name} | ${props.players[props.board.team2.left].name
                    }`;
            } else if (!props.board.team2.left && props.board.team2.right) {
                names.team2 = `${props.players[props.board.team2.right].name}`;
            } else if (props.board.team2.left && !props.board.team2.right) {
                names.team2 = `${props.players[props.board.team2.left].name}`;
            } else if (!props.board.team2.left && !props.board.team2.right) {
                names.team2 = `لم يتم تحديد لاعبى الفريق`;
            }
            return names;
        } else {
            return {
                team1: props.board.team1.manualName,
                team2: props.board.team2.manualName,
            };
        }
    } else {
        return null;
    }
});
const total = computed(() => {
    if (props.board) {
        let team1 = props.board.team1.scores.reduce((s1, s2) => s1 + s2, 0);
        let team2 = props.board.team2.scores.reduce((s1, s2) => s1 + s2, 0);
        return { team1, team2 };
    } else {
        return null;
    }
});
const winner = computed(() => {
    if (total.value.team1 < WiNNING_SCORE && total.value.team2 < WiNNING_SCORE) {
        return null;
    } else if (
        total.value.team1 >= WiNNING_SCORE ||
        total.value.team2 >= WiNNING_SCORE
    ) {
        if (total.value.team1 === total.value.team2) return null;
        else {
            if (total.value.team1 > total.value.team2) return "team1";
            else {
                return "team2";
            }
        }
    }
});

const handleStartRecord = async () => {
    const res = await addDoc({
        name: `(${(new Date()).toLocaleString()}) - ( ${teamsNames.value.team1} ) ضد ( ${teamsNames.value.team2} )`,
        createdAt: new Date(),
        records: [
            {
                startAt: 0,
                event: "start",
                data: {
                    "team1": {
                        "name": teamsNames.value.team1,
                        "scores": props.board.team1.scores,
                    },
                    "team2": {
                        "name": teamsNames.value.team2,
                        "scores": props.board.team2.scores,
                    },
                    winner: winner.value
                }
            }
        ]
    })
    if (!saveDataError.value) {
        props.board.record.state = "running"
        props.board.record.id = res.id
        await handleUpdate()
    }
}

const handleEndRecord = async () => {
    let thisRecord = props.records[props.board.record.id]
    thisRecord.records.push({
        startAt: new Date() - thisRecord.createdAt.seconds * 1000,
        event: "end",
        data: {
            "team1": {
                "name": teamsNames.value.team1,
                "scores": props.board.team1.scores,
            },
            "team2": {
                "name": teamsNames.value.team2,
                "scores": props.board.team2.scores,
            },
            winner: winner.value
        }
    })

    await updateRecord(props.board.record.id, thisRecord)
    if (!errorRecord.value) {
        props.board.record.id = null
        props.board.record.state = "finished"
        await handleUpdate()
    }
}

const handleUpdate = async () => {
    await updateDoc(props.ENV, props.board)
}
const handleDeleteRecord = async (id) => {
    await deleteRecord(id);
}
const handleCopyRecord = (id) => {
    let text = JSON.stringify(props.records[id])
    // console.log(text);
    navigator.clipboard.writeText(text);

}

</script>

<style lang="scss" scoped></style>