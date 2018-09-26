<template>
  <div id="app">
    <!-- <keep-alive> -->
      <router-view></router-view>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #D3DDE5; opacity:1; 
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #D3DDE5;opacity:1;
}

input:-ms-input-placeholder{
    color: #D3DDE5;opacity:1;
}

input::-webkit-input-placeholder{
    color: #D3DDE5;opacity:1;
}
</style>
