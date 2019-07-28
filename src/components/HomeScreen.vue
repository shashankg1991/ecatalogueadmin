<template>
  <div id="app">
    <nav>
        <router-link to='/users'>Manage users</router-link>
        <router-link to='/categories'>Manage categories</router-link>
        <router-link to='/items'>Manage items</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
}
</script>
