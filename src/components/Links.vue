<template>
    <div class="m-5">
        <table class="table table-light table-hover ">
            <thead>
                <tr>
                    <th scope="col">الاسم</th>
                    <th scope="col">الادوات</th>
                    <th scope="col">اذهب الي الموقع</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="l in LINKS" :key="l.link">
                    <th scope="row">{{ l.name }}</th>
                    <td>
                        <button class="btn btn-primary" @click.prevent="handleCopy(l.link)">
                            <i class="bi bi-clipboard2-fill"></i>
                        </button>
                    </td>
                    <td>
                        <a class="btn btn-primary" target="_blank" :href="l.link">
                            <i class="bi bi-arrow-up-right-circle-fill"></i>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
const LINKS = [{
    name: "الحاسبة", link: "https://players-photos.web.app/qayyed"

}, {
    name: "لوحة التحكم", link: "https://players-photos.web.app/admin"

}, {
    name: " شاشة عرض الصور", link: "https://players-photos.web.app/"

}, {
    name: "النشرة", link: "https://players-photos.web.app/calc"

}, {
    name: "لوحة تحكم جدول الدوري واساسونا", link: "https://sam-baloot-admin.online/admin"
}
]

const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
}
</script>

<style lang="scss" scoped></style>