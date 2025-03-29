<template>
  <Drawer
    v-model:visible="active"
    position="left"
    class="sidebar menuSidebar"
    :blockScroll="true"
  >
    <Loader v-if="loading"></Loader>

    <div v-else class="mainMenu">
      <div v-for="item1 in items" :key="`menu_item1_${item1}`" class="group">
        <h5 v-if="item1.label">{{ item1.label }}</h5>

        <template v-if="item1.label === 'Категори'">
          <Accordion :activeIndex="null" class="transparent level1">
            <AccordionTab
              v-for="(item, key) in collections"
              :key="`menu_collection_level1_${key}`"
              :header="getCollectionTitle(item.collection)"
            >
              <Accordion :activeIndex="null" class="transparent level2">
                <AccordionTab
                  v-for="(item2, key2) in item.subcategories"
                  :key="`menu_collection_level2_${key2}`"
                  :header="getCollectionTitle(item2.collection)"
                >
                  <template
                    v-for="key3 in item2.subcategories"
                    :key="`menu_collection_level3_${key3}`"
                  >
                    <h6
                      v-if="item2[key3]"
                      class="mainMenuItem"
                      @click="
                        $bus.$emit('goTo', `/products/${item2[key3].handle}`)
                      "
                    >
                      {{ getCollectionTitle(item2[key3]) }}
                    </h6>
                  </template>

                  <h6
                    class="mainMenuItem"
                    @click="
                      $bus.$emit('goTo', `/products/${item2.collection.handle}`)
                    "
                  >
                    Бүх {{ getCollectionTitle(item2.collection) }} бараа
                    <i class="pi pi-arrow-right"></i>
                  </h6>
                </AccordionTab>
              </Accordion>

              <h6
                class="mainMenuItem"
                @click="
                  $bus.$emit('goTo', `/products/${item.collection.handle}`)
                "
              >
                Бүх {{ getCollectionTitle(item.collection) }} бараа
                <i class="pi pi-arrow-right"></i>
              </h6>
            </AccordionTab>
          </Accordion>
        </template>

        <template v-else>
          <Nuxt-link
            v-for="item in item1.items"
            :key="`menu_item_${item}`"
            :to="item.to"
            @click="$bus.$emit('goTo', item.to)"
          >
            <h6 :class="`level-${item.level}`">
              <i v-if="item.icon" :class="item.icon"></i> {{ item.label }}
            </h6>
          </Nuxt-link>
        </template>
      </div>
    </div>

    <div class="bottom">
      <div>
        <a href="#0"><i class="pi pi-envelope"></i> info@tumenshop.com</a>
        <a href="#0"><i class="pi pi-phone"></i> (976) 77772526</a>
      </div>
    </div>
  </Drawer>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      active: false,
      menuItems: null,
    }
  },

  computed: {
    collections() {
      const store = useCommerceStore()
      return store.collections
    },
    items() {
      let menuItems = [
        {
          label: "",
          items: [
            {
              icon: "pi pi-home",
              label: "Нүүр хуудас",
              to: "/",
              command: (e) => this.$bus.$emit("goTo", e.item.to),
            },
            {
              label: "Дэлгүүр",
              to: "/products/all",
              command: (e) => this.$bus.$emit("goTo", e.item.to),
            },
          ],
        },
        {
          label: "Категори",
          items: null,
        },
        {
          label: "",
          items: [
            {
              label: "Шинэ",
              to: "/products/all?type=new",
              command: (e) => this.$bus.$emit("goTo", e.item.to),
            },
            {
              label: "Хямдрал",
              to: "/products/all?type=sale",
              command: (e) => this.$bus.$emit("goTo", e.item.to),
            },
            {
              label: "Купон",
              to: "/products/all?type=coupon",
              command: (e) => this.$bus.$emit("goTo", e.item.to),
            },
          ],
        },
      ]
      return menuItems
    },
  },

  methods: {
    getCollectionTitle(collection) {
      if (!collection) return

      if (collection.seo) {
        if (collection.seo.title) {
          return collection.seo.title
        }
      }

      let titleItem = collection.title.split("|")

      return titleItem[2]
    },
  },
}
</script>
