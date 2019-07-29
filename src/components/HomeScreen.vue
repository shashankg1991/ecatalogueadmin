<template>
  <div id="app">
    <div>
      <b-jumbotron bg-variant="info" text-variant="white" border-variant="dark">
        <template slot="header">eCatalogue Management</template>
        <template slot="lead">This is eCatalogue Management Application.</template>
        <hr class="my-4">
        <p>User can add and edit the master data using the application.</p>
      </b-jumbotron>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {}
</script>
