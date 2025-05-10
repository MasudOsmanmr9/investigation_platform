<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">Previous</a>
      </li>
      <li
        class="page-item"
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
      >
        <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}/{{ totalPages}}</a>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">Next</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  methods: {
    goToPage(page) {
      console.log('Page changed to:', page);
      if (page < 1 || page > this.totalPages) return;
      this.$emit('page-changed', page);
    }
  }
}
</script>

<style scoped>
.pagination {
  justify-content: center;
}
</style>