<template >
  <div class="bg-red-500 sucess">
    <el-table :data="clients" border>
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="email" label="Email"></el-table-column>
      <el-table-column prop="phone" label="Phone"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clients: [
        { name: "John Doe", email: "john@example.com", phone: "1234567890" },
        { name: "Jane Smith", email: "jane@example.com", phone: "9876543210" },
        // Add more client objects here
      ]
    };
  }
};
</script>
