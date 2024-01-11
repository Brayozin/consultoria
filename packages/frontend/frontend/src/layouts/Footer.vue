<template>
  <footer class="footer">
    <div class="container">
      <div class="p-grid">
        <div class="p-col-12 p-md-6">
          <h3>About Us</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, mauris vel aliquet tincidunt, velit ex tincidunt urna, nec ultrices nunc nisl id nunc.</p>
        </div>
        <div class="p-col-12 p-md-6">
          <h3>Contact Us</h3>
          <p>Email: info@example.com</p>
          <p>Phone: +1 123 456 7890</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
.footer {
  background-color: #f5f5f5;
  padding: 20px;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.p-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.p-col-12 {
  grid-column: span 12;
}

.p-col-md-6 {
  grid-column: span 6;
}

h3 {
  margin-top: 0;
}

p {
  margin-bottom: 10px;
}
</style>
