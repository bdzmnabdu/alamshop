<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { reactive, defineProps, defineEmits, watch, ref } from "vue";
import { Calendar as CalendarIcon } from "lucide-vue-next";

import useHSCode from "@/composables/useHSCode";
import useCities from "@/composables/useCities";
import usePack from "@/composables/usePack";
import type { Dimensi } from "@/types";

interface Trading {
  formId?: string;
  hscode?: string;
  pemesan?: string;
  nohp?: string;
  cityFrom: string;
  countryFrom: string;
  penerima: string;
  cityTo: string;
  countryTo: string;
  jeniskemasan: string;
  dimensi: Dimensi;
  orderdate: string;
  metodelogistik: string;
}

defineProps<{
  dataTrading: Trading;
}>();

const emit = defineEmits<{ (e: "update:dataTrading", data: Trading): void }>();

const form = reactive<Trading>({
  formId: "trd",
  hscode: "",
  pemesan: "",
  nohp: "",
  cityFrom: "",
  countryFrom: "",
  penerima: "",
  cityTo: "",
  countryTo: "",
  jeniskemasan: "",
  dimensi: {
    panjang: 0,
    lebar: 0,
    tinggi: 0,
  },
  orderdate: "",
  metodelogistik: "",
});

const srcVal = ref<string>("");
const { isLoading, hscodes, refetch } = useHSCode(srcVal);
const { cities } = useCities();
const { pack } = usePack();

const searcHSC = (event: any) => {
  srcVal.value = event.target.value;
};

const handleChange = () => {
  const dataQuo: Trading = {
    formId: form.formId,
    hscode: form.hscode,
    pemesan: form.pemesan,
    nohp: form.nohp,
    cityFrom: form.cityFrom,
    countryFrom: form.countryFrom,
    penerima: form.penerima,
    cityTo: form.cityTo,
    countryTo: form.countryTo,
    jeniskemasan: form.jeniskemasan,
    dimensi: {
      panjang: form.dimensi.panjang,
      lebar: form.dimensi.lebar,
      tinggi: form.dimensi.tinggi,
    },
    orderdate: form.orderdate,
    metodelogistik: form.metodelogistik,
  };
  emit("update:dataTrading", dataQuo);
};

watch(
  () => form.hscode,
  (newValue, oldValue) => {
    if (newValue === "" && oldValue !== "") {
      srcVal.value = "";
      refetch();
    }
  },
  { immediate: false }
);

watch(
  [form, srcVal],
  (newValues, oldValues) => {
    const [newForm, newSrcVal] = newValues;
    const [oldForm, oldSrcVal] = oldValues;

    if (newForm !== oldForm) {
      handleChange();
      refetch();
    }

    if (newSrcVal !== oldSrcVal) {
      refetch();
    }
  },
  { immediate: true, deep: true }
);
</script>
<template>
  <section>
    <div id="form-trading" class="flex flex-col gap-5" @change="handleChange">
      <div class="flex flex-col">
        <label class="text-sm font-normal text-slate-700 mb-1">HS Code </label>
        <Popover>
          <PopoverTrigger as-child>
            <div class="relative flex justify-center items-center">
              <Input
                type="text"
                placeholder="e.g. 129003849"
                role="combobox"
                :class="cn('justify-between h-11')"
                v-model="form.hscode"
              />
              <ChevronsUpDown
                class="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-2"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent class="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search HS Code..." @input="searcHSC" />
              <p
                v-if="isLoading && hscodes"
                class="m-5 text-sm text-slate-600 font-medium"
              >
                Search for hscode..
              </p>
              <CommandEmpty v-if="!isLoading">Nothing found.</CommandEmpty>
              <CommandList v-if="!isLoading && hscodes">
                <CommandGroup>
                  <ScrollArea class="h-40">
                    <CommandItem
                      v-for="(hsc, index) in hscodes"
                      :key="index"
                      :value="hsc.code"
                      @select="() => (form.hscode = hsc.code)"
                    >
                      <Check
                        :class="
                          cn(
                            'mr-2 h-4 w-4',
                            hsc.code === form.hscode
                              ? 'opacity-100'
                              : 'opacity-0'
                          )
                        "
                      />
                      {{ hsc.code }}
                    </CommandItem>
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div class="flex flex-col">
        <label class="text-sm font-normal text-slate-700 mb-1">
          HS Code Description
          <span class="text-xs font-normal">(Automatically filled)</span>
        </label>
        <Input
          type="text"
          placeholder="e.g. Kuda, keledai, bagal dan hinnie,- - Bibit"
          :value="form.hscode ? hscodes.find((hsc: any) => hsc.code === form.hscode)?.descriptionlc : 'Select HS Code...'"
          disabled
        />
      </div>
      <div class="flex flex-col">
        <label class="text-sm font-normal text-slate-700 mb-1"
          >Customer <span class="text-red-500 font-semibold">*</span></label
        >
        <Input
          v-model="form.pemesan"
          type="text"
          placeholder="e.g. Customer Name"
          required
        />
      </div>
      <div class="flex flex-col">
        <label class="text-sm font-normal text-slate-700 mb-1"
          >No. Handphone/Telp
          <span class="text-red-500 font-semibold">*</span></label
        >
        <Input
          v-model="form.nohp"
          type="text"
          placeholder="e.g. 0123456789"
          required
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-2">
        <div class="flex flex-col">
          <label class="text-sm font-normal text-slate-700 mb-1"
            >Origin City
            <span class="text-red-500 font-semibold">*</span></label
          >
          <Popover>
            <PopoverTrigger as-child>
              <div class="relative flex items-center justify-center">
                <Input
                  type="text"
                  placeholder="e.g. Jakarta - Halim Perdana Kusuma - HLP"
                  role="combobox"
                  :class="cn('justify-between')"
                  :value="form.cityFrom ? cities.find((cty: any) => cty.city === form.cityFrom)?.city: 'Select City...'"
                  required
                />
                <ChevronsUpDown
                  class="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-2"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent class="w-[300px] md:w-[400px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search City..." />
                <CommandEmpty>Nothing found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <ScrollArea class="h-40">
                      <CommandItem
                        v-for="(cty, index) in cities"
                        :key="index"
                        :value="cty.city"
                        @select="
                          () => {
                            form.cityFrom = cty.city;
                            form.countryFrom = cty.country_name;
                          }
                        "
                      >
                        <Check
                          :class="
                            cn(
                              'mr-2 h-4 w-4',
                              cty.city === form.cityFrom
                                ? 'opacity-100'
                                : 'opacity-0'
                            )
                          "
                        />
                        {{ cty.city }}
                      </CommandItem>
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div id="countryFrom" class="flex flex-col">
          <label class="text-sm font-normal text-slate-700 mb-1"
            >Origin Country
            <span class="text-red-500 font-semibold">*</span></label
          >
          <Input
            name="countryFrom"
            type="text"
            placeholder="e.g. Indonesia"
            :value="form.cityFrom ? cities.find((c: any) => c.city == form.cityFrom)?.country_name : undefined"
            disabled
          />
        </div>
      </div>
      <div id="penerima" class="flex flex-col">
        <label class="text-sm font-normal text-slate-700 mb-1"
          >Recipient <span class="text-red-500 font-semibold">*</span></label
        >
        <Input
          type="text"
          placeholder="e.g. Recipient Name"
          v-model="form.penerima"
          required
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-2">
        <div id="cityTo" class="flex flex-col">
          <label class="text-sm font-normal text-slate-700 mb-1"
            >Destination City
            <span class="text-red-500 font-semibold">*</span></label
          >
          <Popover>
            <PopoverTrigger as-child>
              <div class="relative flex justify-center items-center">
                <Input
                  type="text"
                  placeholder="e.g. Brisbane - BNE"
                  role="combobox"
                  :class="cn('justify-between')"
                  :value="form.cityTo ? cities.find((cty: any) => cty.city === form.cityTo)?.city: 'Select City...'"
                  required
                />
                <ChevronsUpDown
                  class="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-2"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent class="w-[300px] md:w-[400px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search City..." />
                <CommandEmpty>Nothing found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <ScrollArea class="h-40">
                      <CommandItem
                        v-for="(cty, index) in cities"
                        :key="index"
                        :value="cty.city"
                        @select="
                          () => {
                            form.cityTo = cty.city;
                            form.countryTo = cty.country_name;
                          }
                        "
                      >
                        <Check
                          :class="
                            cn(
                              'mr-2 h-4 w-4',
                              cty.city === form.cityTo
                                ? 'opacity-100'
                                : 'opacity-0'
                            )
                          "
                        />
                        {{ cty.city }}
                      </CommandItem>
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div id="countryTo">
          <div class="flex flex-col">
            <label class="text-sm font-normal text-slate-700 mb-1"
              >Destination Country
              <span class="text-red-500 font-semibold">*</span></label
            >
            <Input
              name="countryTo"
              type="text"
              placeholder="e.g. Australia"
              :value="form.cityTo ? cities.find((c: any) => c.city == form.cityTo)?.country_name : undefined"
              disabled
            />
          </div>
        </div>
      </div>
      <div id="jeniskemasan" class="flex flex-col">
        <label class="text-sm font-normal text-slate-700 mb-1"
          >Packaging Type
          <span class="text-red-500 font-semibold">*</span></label
        >
        <Select v-model="form.jeniskemasan" required>
          <SelectTrigger class="w-full h-11 rounded-xl">
            <SelectValue placeholder="Select packaging type" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="(pck, index) in pack"
                :key="index"
                :value="pck.product_id"
              >
                {{ pck.description ?? pck.product_name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="hidden">
        <p class="text-sm font-medium mb-3">Dimension</p>
        <div class="grid grid-cols-3 gap-5">
          <div class="flex flex-col">
            <label class="text-xs font-normal text-slate-700 mb-1"
              >Length(cm)
              <span class="text-red-500 font-semibold">*</span></label
            >
            <Input
              v-model="form.dimensi.panjang"
              type="number"
              min="0"
              placeholder="0"
              required
            />
          </div>

          <div class="flex flex-col">
            <label class="text-xs font-normal text-slate-700 mb-1">
              Width(cm)
              <span class="text-red-500 font-semibold">*</span>
            </label>
            <Input
              type="number"
              min="0"
              placeholder="0"
              v-model="form.dimensi.lebar"
              required
            />
          </div>

          <div class="flex flex-col">
            <label class="text-xs font-normal text-slate-700 mb-1"
              >Height(cm)
              <span class="text-red-500 font-semibold">*</span></label
            >
            <Input
              type="number"
              min="0"
              placeholder="0"
              v-model="form.dimensi.tinggi"
              required
            />
          </div>
        </div>
      </div>
      <div id="orderdate">
        <label class="text-sm font-normal text-slate-700 mb-1"
          >Order Date <span class="text-red-500 font-semibold">*</span></label
        >
        <div class="relative w-full flex justify-center items-center">
          <input
            v-model="form.orderdate"
            type="date"
            placeholder="Pick Order Date"
            class="appearance-none md:appearance-auto h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
          <div
            v-if="!form.orderdate"
            class="md:hidden flex items-center justify-start gap-1 absolute left-2"
          >
            <CalendarIcon class="mr-2 h-4 w-4" />
            <p class="text-slate-500">dd/mm/yyyy</p>
          </div>
        </div>
      </div>
      <div id="metodelogistik">
        <label class="text-sm font-normal text-slate-700 mb-1"
          >Logistics Method
          <span class="text-red-500 font-semibold">*</span></label
        >
        <Select
          v-model="form.metodelogistik"
          @update:modelValue="handleChange"
          aria-required="true"
        >
          <SelectTrigger class="w-full h-11 rounded-xl">
            <SelectValue placeholder="Select Logistics" />
          </SelectTrigger>
          <SelectContent class="w-[400px] md:w-full">
            <SelectGroup>
              <SelectItem value="noalamlog">
                Already has its own logistics choice and will pick up the goods
                directly at the Alams office.
              </SelectItem>
              <SelectItem value="alamlog">
                Ship the box via Alams logistics service
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  </section>
</template>
