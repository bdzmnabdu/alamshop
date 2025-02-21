<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from "vue";

const props = defineProps<{
  selectedOption: string;
  productId: string;
}>();
const emit = defineEmits(["update:selectedOption"]);

console.log(props.productId);
// const optionVal = ref<string>("");
const optionVal = computed({
  get: () => props.selectedOption,
  set: (value) => {
    emit("update:selectedOption", value);
    console.log(value);
  },
});

const options = [
  { value: "live", label: "Live", optFor: ["AOF", "AOS", "AFF", "AC", "AK"] },
  { value: "frozen", label: "Frozen", optFor: ["AC", "AK"] },
  { value: "fresh", label: "Fresh", optFor: ["AC", "AK"] },
];
// const updateSelectedOption = (option: string) => {
//   console.log(option);
//   optionVal.value = option;
//   emit("update:selectedOption", optionVal.value);
//   console.log(optionVal.value);
//   console.log(props.selectedOption);
// };
// watch(optionVal, (newValue) => {
//   console.log(optionVal.value);
//   console.log(props.selectedOption);
//   //   optionVal.value = newValue;
// });
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
