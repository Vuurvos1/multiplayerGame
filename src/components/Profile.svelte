<script>
  import { gameState } from './../store';

  function profileSubmit(e) {
    e.preventDefault();
    $gameState = 'lobby';
  }
</script>

<p>Profile</p>

<form>
  <label>
    <input type="text" />
    <input type="number" min="0" max="6" value="0" />
  </label>

  <button type="submit" on:click={profileSubmit}>submit</button>
</form>
