<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useTrackOrder from "@/composables/useTrackOrder";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ActionLog {
  seq: number;
  docnum: string;
  date: string;
  time: string;
  action: string;
  remarks: string;
  status: string;
}

const ordernum = ref("");
const nodes = reactive<ActionLog[]>([]);
const query = ref<string>("");

const { isLoading, data, refetch } = useTrackOrder(ordernum);
watch(data, (newData) => {
  if (newData && Array.isArray(newData?.data?.actionlog)) {
    const validLogs = newData?.data?.actionlog.filter(
      (item: any): item is ActionLog => {
        return (
          typeof item.seq === "number" &&
          typeof item.docnum === "string" &&
          typeof item.date === "string" &&
          typeof item.time === "string" &&
          typeof item.action === "string" &&
          typeof item.remarks === "string" &&
          typeof item.status === "string"
        );
      }
    );
    console.log(validLogs);
    nodes.splice(0, nodes.length, ...validLogs);
  }
});

const onSubmit = () => {
  ordernum.value = query.value;
  refetch();
};
</script>
<template>
  <section class="md:px-20 py-5 md:py-12 mb-9 mx-2 md:mx-32 flex-1">
    <div class="p-3 md:p-5 rounded-2xl w-full bg-white">
      <div
        id="search-order"
        class="border border-slate-200 p-3 md:p-5 rounded-2xl w-full bg-white"
      >
        <Form @submit="onSubmit">
          <div class="">
            <FormField name="ordernum" class="">
              <FormItem>
                <FormLabel>Your order number</FormLabel>
                <FormControl>
                  <div class="flex justify-start items-center gap-2 w-full">
                    <div class="relative w-full md:w-[300px]">
                      <Input
                        type="search"
                        placeholder="e.g. 920-22149805"
                        v-model="query"
                        @keyup.enter="onSubmit"
                        @keydown.enter.prevent
                      />
                      <button
                        v-if="query"
                        @click="query = ''"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ✖
                      </button>
                    </div>
                    <Button type="submit" class="h-11">
                      <i class="pi pi-search" style="font-size: 0.9rem"></i>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </Form>
      </div>
      <div v-if="isLoading" class="mt-5">
        <div class="w-full">
          <div id="trk-hdr" class="mb-5">
            <div
              class="animate-pulse bg-slate-300 w-48 h-6 mb-2 rounded-md"
            ></div>
            <div
              class="animate-pulse bg-slate-300 w-52 h-4 mb-2 rounded-md"
            ></div>
          </div>
        </div>
        <div class="border border-slate-50 w-full rounded-xl">
          <div class="p-6 bg-slate-50 rounded-lg">
            <div class="flex flex-col gap-4">
              <div>
                <div
                  class="animate-pulse bg-slate-300 w-32 h-6 mb-2 rounded-md"
                ></div>
                <div
                  class="animate-pulse bg-slate-300 w-40 h-4 mb-2 rounded-md"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!isLoading && data?.status === 200"
        id="trk-container"
        class="mt-5 rounded-xl"
      >
        <div class="w-full">
          <div id="trk-hdr" class="mb-5">
            <h1 class="text-2xl font-bold mb-2">Order Tracking</h1>
            <h1>Order ID: {{ ordernum }}</h1>
          </div>
        </div>
        <div id="trck" class="bg-slate-50 rounded-xl">
          <div class="max-w-4xl 2xl:max-w-full mx-auto 2xl:mx-0 p-6">
            <div class="flex flex-col gap-4">
              <!-- Tracking Steps -->
              <div>
                <h1 class="font-semibold mb-4">Timeline</h1>
                <div class="relative">
                  <!-- Nodes and Labels -->
                  <div
                    v-for="(step, index) in nodes"
                    :key="index"
                    class="relative flex items-start gap-4 mb-6"
                  >
                    <div>
                      <div
                        v-if="index < nodes.length - 1"
                        class="absolute w-1 bg-gray-300 h-[70px] left-2 top-0 z-0"
                      ></div>
                      <div
                        class="relative w-5 h-5 flex items-center justify-center rounded-full border-4 z-10 border-green-500 bg-green-500 text-white"
                      ></div>
                    </div>

                    <div>
                      <p class="font-medium text-gray-700">{{ step.action }}</p>
                      <p class="text-sm text-gray-500">
                        {{ step.date }}, {{ step.time }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isLoading && data?.status === 400" class="mt-5 w-full">
        <div class="mb-5 ml-3 md:m-0">
          <p>
            No results found for:
            <span class="text-blue-500">{{ ordernum }} </span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="css" scoped>
input[type="search"]::-webkit-search-cancel-button {
  appearance: none;
}
</style>
