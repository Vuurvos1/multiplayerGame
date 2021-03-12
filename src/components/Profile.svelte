<script>
  import { gameState, username } from './../store';

  let name = '';

  function test(e) {
    e.preventDefault();
    $gameState = 'lobby';
    // trim this value if needed
    $username = name.value;
  }
</script>

<style lang="scss">
  p {
    color: #fff;
  }
</style>

<p>Profile</p>

<form on:submit={test}>
  <label>
    <input type="text" bind:this={name} />
    <input type="number" min="0" max="6" value="0" />
  </label>

  <button type="submit">submit</button>
</form>
