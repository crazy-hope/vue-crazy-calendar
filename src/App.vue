<template>
  <div id="app">
    <CrazyCalendar :areaThings="areaThings"></CrazyCalendar>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      areaThings: [
        {
            start: '2020-4-20',
            end: '2020-4-30',
            things: [
                'Test 1',
            ]
        },
        {
            start: '2020-3-20',
            end: '',
            things: [
                'Test 2',
                'Test 3'
            ]
        }
      ]
    } 
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
