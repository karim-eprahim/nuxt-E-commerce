<template>
    <div class="space-y-4 w-full">

        <!-- Image Grid -->
        <div v-if="images.length" class="grid grid-cols-2 sm:grid-cols-3 gap-4">

            <div v-for="(url, index) in images" :key="url"
                class="relative group aspect-square rounded-xl overflow-hidden border border-border bg-muted shadow-sm">
                <img :src="url"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

                <!-- Remove Overlay -->
                <div
                    class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-end justify-center">
                    <button type="button" @click.stop="removeImage(index)"
                        class="bg-destructive text-destructive-foreground aspect-square w-12 rounded-lg hover:bg-destructive/50 transition flex items-center justify-center absolute top-0 right-0">
                        <Icon name="lucide:trash-2" class="w-5 h-5" />
                    </button>
                    <Badge variant="outline" class="text-white">
                        {{ getResourceName(images[index] as string).name }}
                    </Badge>
                </div>

            </div>

        </div>

        <!-- Upload Button -->
        <button v-if="images.length < maxImages" type="button" @click="openWidget"
            class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl bg-muted/50 hover:bg-muted hover:border-primary transition cursor-pointer"
            :disabled="isUploading">
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                <Icon v-if="!isUploading" name="lucide:image-plus" class="w-6 h-6" />
                <Icon v-else name="lucide:loader-2" class="w-6 h-6 animate-spin" />
            </div>
            <p class="text-sm font-semibold">
                {{ isUploading ? 'Uploading...' : 'Click to upload images' }}
            </p>
            <p class="text-xs text-muted-foreground">
                JPG, PNG, WEBP (Max {{ maxImages }} images)
            </p>
        </button>

    </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

interface CloudinaryUploadInfo {
    secure_url: string
    public_id: string
    format: string
}

interface CloudinaryResult {
    event: string
    info: CloudinaryUploadInfo
}

interface CloudinaryWidget {
    open: () => void
    close: () => void
    destroy: () => void
}
declare global {
    interface Window {
        cloudinary?: {
            createUploadWidget: (
                options: Record<string, unknown>,
                callback: (error: unknown, result: CloudinaryResult) => void
            ) => CloudinaryWidget
        }
    }
}

interface Props {
    modelValue?: { url: string }[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: "update:modelValue", urls: { url: string }[]): void
}>()
const config = useRuntimeConfig()
const cloudName = String(config.public.cloudinaryCloudName)
const uploadPreset = String(config.public.uploadPreset)
const maxImages = 5
const allowedFormats = ['jpg', 'jpeg', 'png', 'webp']
const images = ref<string[]>(
    props.modelValue?.map(i => i.url) ?? []
)
const isUploading = ref(false)
let widget: CloudinaryWidget | null = null

watch(
    () => props.modelValue,
    (val) => {
        if (val) images.value = val?.map(i => i.url) ?? []
    }
)

const emitChange = () => {
    emit(
        "update:modelValue",
        images.value.map((url) => ({ url }))
    )
}

const createWidget = () => {

    if (!window.cloudinary) {
        console.error("Cloudinary widget not loaded")
        return
    }

    widget = window.cloudinary.createUploadWidget(
        {
            cloudName,
            uploadPreset,
            sources: ['local', 'url'],
            multiple: true,
            maxFiles: maxImages,
            clientAllowedFormats: allowedFormats,
            folder: "products"
        },

        (error, result) => {

            if (error) {
                console.error("Upload error:", error)
                isUploading.value = false
                return
            }
            if (result.event === "success") {
                const url = result.info.secure_url
                if (!images.value.includes(url) && images.value.length < maxImages) {
                    images.value.push(url)
                    emitChange()
                }
            }
            if (result.event === "close") {
                isUploading.value = false
            }
        }
    )
}

const openWidget = () => {
    if (typeof window === "undefined") return
    if (!widget) {
        createWidget()
    }
    if (!widget) return
    isUploading.value = true
    widget.open()
}

const removeImage = async (index: number) => {
    const { public_id,name } = getResourceName(images.value[index] as string)
    await $fetch(`/api/admin/products/image/${name}`, {
      method: "DELETE",
    });
    images.value.splice(index, 1)
    emitChange()
}
onUnmounted(() => {
    widget?.destroy()
})
</script>