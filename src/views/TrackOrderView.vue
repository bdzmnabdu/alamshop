<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useTrackOrder from "@/composables/useTrackOrder";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
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
const formSchema = toTypedSchema(
  z.object({
    ordernum: z
      .string()
      .length(11, "Order number must be exactly 11 characters long."),
  })
);

const ordernum = ref("");
const nodes = reactive<ActionLog[]>([]);

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

const onSubmit = (values: any) => {
  ordernum.value = values.ordernum;
  refetch();
};
</script>
<template>
  <section class="md:px-20 py-5 md:py-12 mb-9 mx-2 md:mx-32 flex-1">
    <div
      id="search-order"
      class="border border-slate-200 p-5 rounded-xl w-full"
    >
      <Form :validation-schema="formSchema" @submit="onSubmit">
        <div class="flex justify-start items-center gap-3">
          <FormField v-slot="{ field }" name="ordernum" class="">
            <FormItem>
              <FormLabel>Your order number</FormLabel>
              <FormControl>
                <div class="flex justify-start items-center gap-2">
                  <Input
                    type="text"
                    placeholder="e.g. 45000000010"
                    v-bind="field"
                    class="w-[245px] md:w-[300px]"
                  />
                  <Button type="submit"> Search </Button>
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
        <div class="max-w-4xl mx-auto p-6 bg-slate-50 rounded-lg">
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
                    <!-- Vertical Line -->
                    <div
                      v-if="index < nodes.length - 1"
                      class="absolute w-1 bg-gray-300 h-[70px] left-2 top-0 z-0"
                    ></div>
                    <!-- Node -->
                    <div
                      class="relative w-5 h-5 flex items-center justify-center rounded-full border-4 z-10 border-green-500 bg-green-500 text-white"
                    ></div>
                  </div>

                  <!-- Step Details -->
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
      <div class="mb-5">
        <p>No results found for: '{{ ordernum }}'</p>
      </div>
    </div>
  </section>
</template>
