<script setup lang="ts">
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { ref } from "vue";
import { useTrackOrderStore } from "@/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const router = useRouter();

const formSchema = toTypedSchema(
  z.object({
    ordernum: z.string().min(11).max(11),
  })
);

const ordernum = ref("");

const trackOrderStore = useTrackOrderStore();

const onSubmit = (values: any) => {
  ordernum.value = values.ordernum;
  trackOrderStore.state.ordernum = values.ordernum;
  router.push("/track-order");
};
</script>
<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="formSchema">
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline">
          <i class="pi pi-truck" style="font-size: 1.2rem"></i>
          Track Order
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lacak Pesanan Saya</DialogTitle>
          <DialogDescription>
            Gunakan nomor pesanan Anda untuk melacak pesanan anda.
          </DialogDescription>
        </DialogHeader>

        <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
          <FormField v-slot="{ componentField }" name="ordernum">
            <FormItem>
              <FormLabel>Nomor Pesanan</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="e.g 45000000001"
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription>
                Pastikan nomor pesanan 9 digit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>

        <DialogFooter>
          <DialogClose>
            <Button type="submit" form="dialogForm"> Lacak </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>
