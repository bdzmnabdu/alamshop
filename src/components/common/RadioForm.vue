<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps<{
  selectedOption: string;
  productId: string;
}>();
const emit = defineEmits(["update:selectedOption"]);

const optionVal = computed({
  get: () => props.selectedOption,
  set: (value) => {
    emit("update:selectedOption", value);
  },
});

const options = [
  { value: "live", label: "Live", optFor: ["AOF", "AOS", "AFF", "AC", "AK"] },
  { value: "frozen", label: "Frozen", optFor: ["AC", "AK"] },
  { value: "fresh", label: "Fresh", optFor: ["AC", "AK"] },
];
</script>

<template>
  <div class="max-w-md mx-auto bg-white">
    <div class="flex justify-start items-start gap-2">
      <label
        v-for="option in options.filter((opt) => {
          const prodPrefix = props.productId.split('-')[0];
          return opt.optFor.includes(prodPrefix);
        })"
        :key="option.value"
        class="flex items-center cursor-pointer py-1 px-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
        :class="{
          'border-orange-500 bg-orange-100': optionVal === option.value,
        }"
      >
        <input
          type="radio"
          v-model="optionVal"
          :value="option.value"
          :checked="selectedOption === option.value"
          class="hidden"
        />
        <span class="text-gray-700 text-sm">{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>
