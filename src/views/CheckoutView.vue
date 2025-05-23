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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { computed, reactive, ref, watch } from "vue";
import useHSCode from "@/composables/useHSCode";
import useCities from "@/composables/useCities";
import { postQuo } from "@/api";
import FormTrading from "@/components/layout/FormTrading.vue";
import { useCartStore } from "@/store";
import { useRouter } from "vue-router";
import useSkaCoo from "@/composables/useSkaCoo";
import { TokenService } from "@/services/TokenService";
import useProductsLogistic from "@/composables/useProductsLogistic";
import useNoWA from "@/composables/useNoWA";
import type { CartItem, Dimensi } from "@/types";
import usePack from "@/composables/usePack";

const router = useRouter();

const token = TokenService.getToken();
if (!token && !TokenService.verifyToken(token as string)) {
  router.push("/");
}

interface FormTrading {
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

interface FormLogistik {
  formId?: string;
  ekspedisi: string;
  incoterm: string;
  komoditi: string;
  hscode?: string;
  weight: number;
  jmlKemasan: number;
  pengirim: string;
  nohppengirim: string;
  ktpnpwpPengirim: string;
  alamatPengirim: string;
  negaraAsalPengirim: string;
  legalitasPT?: string | File;
  namaEksportir: string;
  alamatEksportir: string;
  ktpnpwpEksportir: string;
  negaraAsalEksportir: string;
  namaPenerima: string;
  alamatPenerima: string;
  negaraAsalPenerima: string;
  skacoo?: string;
  namaImportir: string;
  alamatImportir: string;
  negaraAsalImportir: string;
  insurance: string;
}

const form = reactive<{
  dataTrading: FormTrading;
  dataLogistik: FormLogistik;
  cart: CartItem[];
}>({
  dataTrading: {
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
  },
  dataLogistik: {
    formId: "log",
    ekspedisi: "",
    incoterm: "",
    komoditi: "",
    hscode: "",
    weight: 0,
    jmlKemasan: 0,
    pengirim: "",
    nohppengirim: "",
    ktpnpwpPengirim: "",
    alamatPengirim: "",
    negaraAsalPengirim: "",
    legalitasPT: undefined,
    namaEksportir: "",
    alamatEksportir: "",
    ktpnpwpEksportir: "",
    negaraAsalEksportir: "",
    namaPenerima: "",
    alamatPenerima: "",
    negaraAsalPenerima: "",
    skacoo: "",
    namaImportir: "",
    alamatImportir: "",
    negaraAsalImportir: "",
    insurance: "false",
  },
  cart: [],
});
const isCheckedEksportir = ref(false);
const isCheckedImportir = ref(false);
const isSubmitted = ref(false);

const { hscodes } = useHSCode();
const { cities } = useCities();
const { govreg } = useSkaCoo();
const { productsLogistic } = useProductsLogistic();
const { nowa } = useNoWA();
const { pack } = usePack();

const cartStore = useCartStore();
form.cart = cartStore.state.cart;

const handleChangeEksp = () => {
  isCheckedEksportir.value = !isCheckedEksportir.value;
};
const handleChangeImpr = () => {
  isCheckedImportir.value = !isCheckedImportir.value;
};

const hscodeLog = computed(() => form.dataTrading.hscode);
const hscodedesclog = computed(() =>
  form.dataTrading.hscode
    ? hscodes.value.find((hsc: any) => hsc.code === form.dataTrading.hscode)
        ?.descriptionlc
    : ""
);
const namaPengirimLogVal = computed(() => form.dataTrading.pemesan);
const alamatPengirimLogVal = computed(() => form.dataTrading.cityFrom);
const noHpLogVal = computed(() => form.dataTrading.nohp);

const namaEksportirLogVal = computed({
  get: () =>
    isCheckedEksportir.value == true ? form.dataLogistik.pengirim : "",
  set: (val) => (form.dataLogistik.namaEksportir = val),
});

watch(
  [
    () => form.dataTrading.hscode,
    () => form.dataTrading.pemesan,
    () => form.dataTrading.nohp,
    () => form.dataTrading.cityFrom,
    () => isCheckedEksportir.value,
    () => isCheckedImportir.value,
  ],
  ([
    newHSCode,
    newPemesan,
    newNoHp,
    newCityFrom,
    newCheckedEks,
    newCheckedImpr,
  ]) => {
    form.dataLogistik.hscode = newHSCode;
    form.dataLogistik.pengirim = newPemesan as string;
    form.dataLogistik.nohppengirim = newNoHp as string;
    form.dataLogistik.alamatPengirim = newCityFrom;
    form.dataLogistik.negaraAsalPengirim = newCityFrom
      ? form.dataTrading.countryFrom
      : "";
    form.dataLogistik.namaEksportir = newCheckedEks
      ? form.dataLogistik.pengirim
      : "";
    form.dataLogistik.ktpnpwpEksportir = newCheckedEks
      ? form.dataLogistik.ktpnpwpPengirim
      : "";
    form.dataLogistik.alamatEksportir = newCheckedEks
      ? form.dataLogistik.alamatPengirim
      : "";
    form.dataLogistik.negaraAsalEksportir = newCheckedEks
      ? form.dataLogistik.negaraAsalPengirim
      : "";
    form.dataLogistik.namaImportir = newCheckedImpr
      ? form.dataLogistik.namaPenerima
      : "";
    form.dataLogistik.alamatImportir = newCheckedImpr
      ? form.dataLogistik.alamatPenerima
      : "";
    form.dataLogistik.negaraAsalImportir = newCheckedImpr
      ? form.dataLogistik.negaraAsalPenerima
      : "";
  },
  { immediate: true }
);

const onSubmit = async () => {
  const fileInput = document.getElementById(
    "certificate-cl"
  ) as HTMLInputElement | null;

  const dataLog: FormLogistik = {
    formId: form.dataLogistik.formId,
    ekspedisi: form.dataLogistik.ekspedisi,
    incoterm: form.dataLogistik.incoterm,
    komoditi: form.dataLogistik.komoditi,
    hscode: form.dataTrading.hscode,
    weight: form.dataLogistik.weight,
    jmlKemasan: form.dataLogistik.jmlKemasan,
    pengirim: form.dataLogistik.pengirim,
    nohppengirim: form.dataLogistik.nohppengirim,
    ktpnpwpPengirim: form.dataLogistik.ktpnpwpPengirim,
    alamatPengirim: form.dataLogistik.alamatPengirim,
    negaraAsalPengirim: form.dataLogistik.negaraAsalPengirim,
    legalitasPT: fileInput?.files?.[0],
    namaEksportir: form.dataLogistik.namaEksportir,
    alamatEksportir: form.dataLogistik.alamatEksportir,
    ktpnpwpEksportir: form.dataLogistik.ktpnpwpEksportir,
    negaraAsalEksportir: form.dataLogistik.negaraAsalEksportir,
    namaPenerima: form.dataLogistik.namaPenerima,
    alamatPenerima: form.dataLogistik.alamatPenerima,
    negaraAsalPenerima: form.dataLogistik.negaraAsalPenerima,
    skacoo: form.dataLogistik.skacoo,
    namaImportir: form.dataLogistik.namaImportir,
    alamatImportir: form.dataLogistik.alamatImportir,
    negaraAsalImportir: form.dataLogistik.negaraAsalImportir,
    insurance: form.dataLogistik.insurance,
  };
  const formDataQuo: { [key: string]: any } = {
    ...form.dataTrading,
    dtLog: form.dataTrading.metodelogistik === "alamlog" ? dataLog : "",
    cart: [...form.cart],
  };

  console.log(formDataQuo);
  try {
    const response = await postQuo(formDataQuo);
    console.log("Success:", response);
    if (response.status === 200) {
      isSubmitted.value = true;
      cartStore.clearCart();
      router.push("/checkout/success");
      const phoneNumber: string = nowa.value.nowa ?? "628983224705"; // Nomor tujuan WhatsApp

      const dataLog: { [key: string]: string | undefined } = {
        "Expedition Service": formDataQuo.dtLog.ekspedisi
          ? productsLogistic.value.find(
              (bx: { [key: string]: string }) =>
                bx.product_id === formDataQuo.dtLog.ekspedisi
            )?.product_name
          : "",
        Incoterm: formDataQuo.dtLog.incoterm,
        Commodity: formDataQuo.dtLog.komoditi,
        Weight: formDataQuo.dtLog.weight,
        "Total Packages": formDataQuo.dtLog.jmlKemasan,
        Sender: formDataQuo.dtLog.pengirim,
        "No Hp/Telp": formDataQuo.dtLog.nohppengirim,
        "KTP/NPWP": formDataQuo.dtLog.ktpnpwpPengirim,
        "Origin City": formDataQuo.dtLog.alamatPengirim,
        "Origin Country": formDataQuo.dtLog.negaraAsalPengirim,
        "Company Legality Certificate": formDataQuo.dtLog.legalitasPT
          ? fileInput?.files?.[0].name
          : "",
        "Exporter Name": formDataQuo.dtLog.namaEksportir,
        "KTP/NPWP Eksportir": formDataQuo.dtLog.ktpnpwpEksportir,
        "Origin City Eksportir": formDataQuo.dtLog.alamatEksportir,
        "Origin Country Eksportir": formDataQuo.dtLog.negaraAsalEksportir,
        Recipient: formDataQuo.dtLog.namaPenerima,
        "Destination City": formDataQuo.dtLog.alamatPenerima,
        "Destination Country": formDataQuo.dtLog.negaraAsalPenerima,
        "SKA/COO": formDataQuo.dtLog.skacoo,
        "Importer Name": formDataQuo.dtLog.namaImportir,
        "Importer's City": formDataQuo.dtLog.alamatImportir,
        "Importer's Country": formDataQuo.dtLog.negaraAsalImportir,
        Insurance: formDataQuo.dtLog.insurance ? "Yes" : "No",
      };
      // console.log(dataLog);

      const message: string = [
        `Halo, saya ${formDataQuo.pemesan}. Saya pesan dengan detail sebagai berikut:`,
        "",
        `HSCode: ${formDataQuo.hscode}`,
        `Customer: ${formDataQuo.pemesan}`,
        `Origin City: ${formDataQuo.cityFrom}`,
        `Origin Country: ${formDataQuo.countryFrom}`,
        `Recipient : ${formDataQuo.penerima}`,
        `Destination City: ${formDataQuo.cityTo}`,
        `Destination Country: ${formDataQuo.countryTo}`,
        `Type of packaging: ${
          formDataQuo.jeniskemasan
            ? pack.value.find(
                (p: any) => p.product_id === formDataQuo.jeniskemasan
              )?.description
            : ""
        }`,
        `Order Date: ${formDataQuo.orderdate}`,
        `Logistics: ${
          formDataQuo.metodelogistik === "alamlog"
            ? "With alam logistic"
            : "Already has its own logistic"
        }`,
        `Logistics Data:\n${
          formDataQuo.metodelogistik === "alamlog"
            ? Object.entries(dataLog)
                .map(([key, value]) => `  - ${key}: ${value}`)
                .join("\n")
            : ""
        }`,
        `Cart:\n${formDataQuo.cart
          .map(
            (item: CartItem) =>
              `  - ${item.product_name}\nKondisi: ${item.cond}\nQuantity: ${item.quantity}`
          )
          .join("\n")}`,
      ].join("\n");
      const waUrl: string = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

      window.open(waUrl, "_blank");
    }
  } catch (error) {
    throw error;
  }
};
</script>
<template>
  <section class="w-full px-2 md:px-32 mb-9 flex-1">
    <RouterLink
      :to="{ path: '/' }"
      class="flex items-center gap-3 cursor-pointer my-5 w-fit bg-orange-100 py-2 px-3 rounded-xl"
    >
      <span class="pi pi-arrow-left text-xs text-orange-900"></span>
      <p class="text-sm hover:underline text-orange-900">Back</p>
    </RouterLink>
    <div class="md:flex md:gap-4 relative w-full m-0">
      <div id="form" class="bg-white md:w-3/5 p-5 md:p-10 rounded-2xl mb-4">
        <div id="form-hd">
          <h1
            class="text-lg font-semibold border-b-4 border-slate-800 w-fit mb-5"
          >
            Checkout
          </h1>
          <p class="text-lg">Form Pre-Order Trading</p>
        </div>
        <div id="form-dt" class="mt-5">
          <form @submit.prevent="onSubmit" class="flex flex-col gap-7">
            <div id="form-trading" class="flex flex-col gap-7">
              <FormTrading v-model:data-trading="form.dataTrading" />
            </div>
            <hr />
            <div
              v-if="form.dataTrading.metodelogistik == 'alamlog'"
              id="form-logistik"
              class="flex flex-col gap-7"
            >
              <legend class="text-xl font-normal">Form ALams Logistik</legend>
              <div id="jenis-transportasi">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >Expedition Service
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <Select v-model="form.dataLogistik.ekspedisi" required>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select Expedition Service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="(lg, i) in productsLogistic"
                        :key="i"
                        :value="lg.product_id"
                        >{{ lg.product_name }}</SelectItem
                      >
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div id="incoterm">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >Incoterm
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <Select v-model="form.dataLogistik.incoterm" required>
                  <SelectTrigger class="w-full">
                    <SelectValue
                      placeholder="e.g. CIF (Cost, Insurance, and Freight)"
                    />
                  </SelectTrigger>
                  <SelectContent class="w-fit">
                    <SelectGroup>
                      <ScrollArea>
                        <SelectItem value="fob"
                          >FOB (Free on Board)
                        </SelectItem>
                        <SelectItem value="cif"
                          >CIF (Cost, Insurance, and Freight)
                        </SelectItem>
                      </ScrollArea>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >Commodity
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <Input
                  v-model="form.dataLogistik.komoditi"
                  type="text"
                  placeholder="e.g. Salmon Fish"
                  required
                />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1">
                  HS Code
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 03038928"
                  v-model="hscodeLog"
                  disabled
                />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1">
                  HS Code Description
                  <span class="text-xs font-normal"
                    >(Automatically filled)</span
                  >
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Kuda, keledai, bagal dan hinnie,- - Bibit"
                  v-model="hscodedesclog"
                  disabled
                />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >Weight
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <Input
                  v-model="form.dataLogistik.weight"
                  type="number"
                  placeholder="e.g. 100"
                  required
                />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >Total Packages
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <Input
                  v-model="form.dataLogistik.jmlKemasan"
                  type="number"
                  placeholder="e.g. 10"
                  required
                />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >Sender Name
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <Input
                  v-model="namaPengirimLogVal"
                  type="text"
                  placeholder="e.g. Sender Name"
                  disabled
                />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >No. Handphone/Telp
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <Input
                  v-model="noHpLogVal"
                  type="text"
                  placeholder="e.g. 0123456789"
                  disabled
                />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >KTP / NPWP
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <Input
                  v-model="form.dataLogistik.ktpnpwpPengirim"
                  type="text"
                  placeholder="e.g. 3216060123456788"
                  required
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-2">
                <div class="flex flex-col">
                  <label class="text-sm font-normal text-slate-700 mb-1"
                    >Origin City
                    <span class="text-red-500 font-semibold">*</span></label
                  >
                  <div class="relative">
                    <Input
                      type="text"
                      placeholder="e.g. Jakarta - Halim Perdana Kusuma - HLP"
                      v-model="alamatPengirimLogVal"
                      disabled
                    />
                  </div>
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
                    :value="form.dataLogistik.alamatPengirim ? cities.find((c: any) => c.city === form.dataLogistik.alamatPengirim)?.country_name : undefined"
                    disabled
                  />
                </div>
              </div>
              <div>
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >Company Legality Certificate (NPWP/NIB)
                  <span class="text-red-500 font-semibold">*</span>
                </label>
                <Input type="file" id="certificate-cl" name="certificate-cl" />
                <p class="text-xs text-slate-700 mt-1">
                  *File format in JPG, JPEG, or PDF
                </p>
              </div>
              <div
                class="flex flex-row items-center justify-between rounded-xl border p-4"
              >
                <div class="space-y-0.5">
                  <label class="text-base"> Exporter Data </label>
                  <p class="text-xs md:text-sm text-slate-700">
                    Is Exporter Data the same as Shipper Data?
                  </p>
                </div>
                <div class="flex flex-col items-end">
                  <Switch @update:checked="handleChangeEksp()" />
                  <p v-if="isCheckedEksportir">Yes</p>
                  <p v-else>No</p>
                </div>
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >Exporter Name
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <Input
                  v-model="namaEksportirLogVal"
                  type="text"
                  placeholder="e.g. Exporter Name"
                  required
                />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >KTP / NPWP
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <Input
                  v-model="form.dataLogistik.ktpnpwpEksportir"
                  type="text"
                  placeholder="e.g. 3216060123456788"
                  required
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-2">
                <div class="flex flex-col">
                  <label class="text-sm font-normal text-slate-700 mb-1"
                    >Exporter’s Origin City
                    <span class="text-red-500 font-semibold">*</span></label
                  >
                  <Popover>
                    <PopoverTrigger as-child>
                      <div class="relative flex justify-center items-center">
                        <Input
                          type="text"
                          placeholder="e.g. Jakarta - Halim Perdana Kusuma - HLP"
                          role="combobox"
                          :class="cn('justify-between')"
                          :value="form.dataLogistik.alamatEksportir ? cities.find((cty: any) => cty.city === form.dataLogistik.alamatEksportir)?.city: 'Select City...'"
                          required
                        />
                        <ChevronsUpDown
                          class="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-2"
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      class="w-[300px] md:w-[400px] p-0"
                      align="start"
                    >
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
                                    form.dataLogistik.alamatEksportir =
                                      cty.city;
                                    form.dataLogistik.negaraAsalEksportir =
                                      cty.country_name;
                                  }
                                "
                              >
                                <Check
                                  :class="
                                    cn(
                                      'mr-2 h-4 w-4',
                                      cty.city ===
                                        form.dataLogistik.alamatEksportir
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
                    >Exporter’s Origin Country
                    <span class="text-red-500 font-semibold">*</span></label
                  >
                  <Input
                    name="countryFrom"
                    type="text"
                    placeholder="e.g. Indonesia"
                    :value="form.dataLogistik.alamatEksportir ? cities.find((c: any) => c.city == form.dataLogistik.alamatEksportir)?.country_name : undefined"
                    disabled
                  />
                </div>
              </div>
              <div id="penerima" class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >Recipient Name
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <Input
                  type="text"
                  placeholder="e.g. Nama Penerima"
                  v-model="form.dataLogistik.namaPenerima"
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
                          :value="form.dataLogistik.alamatPenerima ? cities.find((cty: any) => cty.city === form.dataLogistik.alamatPenerima)?.city: 'Select City...'"
                          required
                        />
                        <ChevronsUpDown
                          class="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-2"
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      class="w-[300px] md:w-[400px] p-0"
                      align="start"
                    >
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
                                    form.dataLogistik.alamatPenerima = cty.city;
                                    form.dataLogistik.negaraAsalPenerima =
                                      cty.country_name;
                                  }
                                "
                              >
                                <Check
                                  :class="
                                    cn(
                                      'mr-2 h-4 w-4',
                                      cty.city ===
                                        form.dataLogistik.alamatPenerima
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
                      :value="form.dataLogistik.alamatPenerima ? cities.find((c: any) => c.city == form.dataLogistik.alamatPenerima)?.country_name : undefined"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div id="skacoo" class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >SKA/COO
                </label>
                <Popover>
                  <PopoverTrigger as-child>
                    <div class="relative flex justify-center items-center">
                      <Input
                        type="text"
                        placeholder="e.g. FORM A (FOR GENERAL PRODUCT), FORM HANDICRAFT (FOR HAND MADE PRODUCT)"
                        role="combobox"
                        :class="cn('justify-between')"
                        :value="form.dataLogistik.skacoo ? govreg.find((gvr: any) => gvr.govreg === form.dataLogistik.skacoo)?.govreg: 'Select SKA/COO...'"
                      />
                      <ChevronsUpDown
                        class="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-2"
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    class="w-[330px] md:w-[500px] p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Search City..." />
                      <CommandEmpty>Nothing found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          <ScrollArea class="h-40">
                            <CommandItem
                              v-for="(gvr, index) in govreg"
                              :key="index"
                              :value="gvr.govreg"
                              @select="
                                () => {
                                  form.dataLogistik.skacoo = gvr.govreg;
                                }
                              "
                            >
                              <Check
                                :class="
                                  cn(
                                    'mr-2 h-4 w-4',
                                    gvr.govreg === form.dataLogistik.skacoo
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )
                                "
                              />
                              {{ gvr.govreg }}
                            </CommandItem>
                          </ScrollArea>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div
                class="flex flex-row items-center justify-between rounded-xl border p-4"
              >
                <div class="space-y-0.5">
                  <label class="text-base">Importer Data </label>
                  <p class="text-xs md:text-sm text-slate-700">
                    Is Importer Data the same as Recipient Data?
                  </p>
                </div>
                <div class="flex flex-col items-end">
                  <Switch @update:checked="handleChangeImpr" />
                  <p v-if="isCheckedImportir">Yes</p>
                  <p v-else>No</p>
                </div>
              </div>
              <div id="penerima" class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >Importer Name
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <Input
                  type="text"
                  placeholder="e.g. Nama Penerima"
                  v-model="form.dataLogistik.namaImportir"
                  required
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-2">
                <div id="cityTo" class="flex flex-col">
                  <label class="text-sm font-normal text-slate-700 mb-1"
                    >Importer's City
                    <span class="text-red-500 font-semibold">*</span></label
                  >
                  <Popover>
                    <PopoverTrigger as-child>
                      <div class="relative">
                        <Input
                          type="text"
                          placeholder="e.g. Brisbane - BNE"
                          role="combobox"
                          :class="cn('justify-between')"
                          :value="form.dataLogistik.alamatImportir ? cities.find((cty: any) => cty.city === form.dataLogistik.alamatImportir)?.city: 'Select City...'"
                          required
                        />
                        <ChevronsUpDown
                          class="ml-2 h-4 w-4 shrink-0 opacity-50 absolute right-2 top-2.5"
                        />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      class="w-[300px] md:w-[400px] p-0"
                      align="start"
                    >
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
                                    form.dataLogistik.alamatImportir = cty.city;
                                    form.dataLogistik.negaraAsalImportir =
                                      cty.country_name;
                                  }
                                "
                              >
                                <Check
                                  :class="
                                    cn(
                                      'mr-2 h-4 w-4',
                                      cty.city ===
                                        form.dataLogistik.alamatImportir
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
                      >Importer' Country
                      <span class="text-red-500 font-semibold">*</span></label
                    >
                    <Input
                      name="countryTo"
                      type="text"
                      placeholder="e.g. Australia"
                      :value="form.dataLogistik.alamatImportir ? cities.find((c: any) => c.city == form.dataLogistik.alamatImportir)?.country_name : undefined"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div id="insurance" class="flex flex-col">
                <label class="text-sm font-normal text-slate-700 mb-1"
                  >Insurance?
                  <span class="text-red-500 font-semibold">*</span></label
                >
                <RadioGroup
                  default-value="option-one"
                  v-model="form.dataLogistik.insurance"
                  required
                >
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem id="option-one" value="true" />
                    <label for="option-one" class="text-sm">Yes</label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem id="option-two" value="false" />
                    <label for="option-two" class="text-sm">No</label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <Button type="submit" class="h-11 text-base md:text-sm">
              <p>Place Order</p>
            </Button>
          </form>
        </div>
      </div>
      <div
        id="item-ckt"
        class="bg-white md:w-2/5 rounded-2xl p-3 h-fit md:sticky md:top-20"
      >
        <h2 class="border-b-2 border-slate-800 w-fit mb-5">Your Items</h2>
        <div id="cart" class="w-full h-fit">
          <div
            v-for="item in cartStore.state.cart"
            :key="item.product_id"
            class="flex items-center gap-2 border rounded-xl my-2 p-2 bg-white"
          >
            <div
              id="img-itm"
              class="w-20 h-10 rounded-md overflow-hidden bg-white"
            >
              <img :src="item.image_url" alt="" class="w-full object-cover" />
            </div>
            <div id="cnt-itm" class="flex flex-col gap-1 w-full">
              <p class="font-normal text-sm">
                {{ item.product_name }}
              </p>
              <p class="font-normal text-sm">
                {{ item.cond }}
              </p>
              <div class="flex justify-between items-center">
                <div id="act" class="flex items-center justify-between w-full">
                  <p class="text-xs">{{ item.quantity }} {{ item.uom }}</p>
                </div>
              </div>
            </div>
          </div>
          <hr class="my-5" />
          <RouterLink to="/products/fishery/aof">
            <button
              class="flex justify-center items-center gap-2 text-sm text-slate-600 border-2 border-dashed border-slate-300 rounded-xl p-2 w-full bg-slate-50 shadow-none hover:bg-non"
            >
              <i class="pi pi-cart-plus" style="font-size: 1.2rem"></i>
              <p class="hover:underline">Add item</p>
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
