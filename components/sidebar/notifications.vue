<template>
  <Drawer
    v-model:visible="active"
    position="right"
    class="sidebar accountSidebar"
    :header="$utils.t('Notifications')"
    :blockScroll="true"
  >
    <div class="emptyArea">
      <div>
        <i class="pi pi-bell"></i>
        <h4>Мэдэгдэлд бүртгүүлэх</h4>
        <p>
          Та мэдэгдэлд бүртгүүлснээр шинэ, хямдралтай барааны мэдээ болон
          захиалгын хүргэлтийн явцын мэдэдлийг хүлээн авах боломжтой болно.
        </p>

        <Button
          label="Бүртгүүлэх"
          severity="contrast"
          class="sp_notify_prompt"
        ></Button>
      </div>
    </div>
  </Drawer>
</template>

<script>
export default {
  data() {
    return {
      active: false,
    }
  },
}
</script>
