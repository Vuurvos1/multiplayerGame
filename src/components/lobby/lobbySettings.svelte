<script>
  import { q } from '../../modules/helpers';
  import { socket, gameState } from './../../store';

  export let roomId;

  // $: roomId = '';
  // $socket.on('roomValue', (data) => {
  //   roomId = `${window.location.origin}/?${data}`;
  // });

  function gameStart(e) {
    e.preventDefault();
    $gameState = 'game';
  }

  function copyLink() {
    // copy game room url
    const text = roomId;
    // Create a fake textarea
    const textAreaEle = document.createElement('textarea');
    // Reset styles
    textAreaEle.style.border = '0';
    textAreaEle.style.padding = '0';
    textAreaEle.style.margin = '0';
    // Set the absolute position
    // User won't see the element
    textAreaEle.style.position = 'absolute';
    textAreaEle.style.left = '-9999px';
    textAreaEle.style.top = `0px`;
    // Set the value
    textAreaEle.value = text;
    // Append the textarea to body
    document.body.appendChild(textAreaEle);
    // Focus and select the text
    textAreaEle.focus();
    textAreaEle.select();
    // Execute the "copy" command
    try {
      document.execCommand('copy');
    } catch (err) {
      // Unable to copy
    } finally {
      // Remove the textarea
      document.body.removeChild(textAreaEle);
    }
  }
</script>

<style lang="scss"></style>

<div class={$$props.class}>
  <form action="">
    <label>
      Rounds
      <input
        type="number"
        name="rounds"
        id="rounds"
        value="3"
        min="1"
        max="25"
        maxlength="3"
      />
    </label>

    <label id="drawTime">
      Draw Time
      <input
        type="number"
        name="drawTime"
        value="30"
        min="1"
        max="120"
        maxlength="3"
      />
    </label>

    <!-- <label for="language"></label>
    <select id="language" name="language">
      <option value="english">English</option>
      <option value="dutch">Dutch</option>
    </select> -->

    <div class="customWords">
      <label for="customWords">Custom Words</label>
      <textarea
        name="customWords"
        cols="30"
        rows="10"
        placeholder="Type your custom words here separated by commas
      "
      />
    </div>

    <div class="customWordsCheck">
      <input
        class="checkbox"
        name="customWordsOnly"
        type="checkbox"
        id="customWordsOnly"
      />
      <label for="customWordsOnly">Only use custom words</label>
    </div>

    <button type="submit" class="startGame" on:click={gameStart}
      >Start Game</button
    >
  </form>

  <h3>Room code:</h3>
  <div id="roomCode">
    <input class="roomCode__Text" value={roomId} type="text" readonly />
    <button class="button button--copyLink" on:click={copyLink}>Copy</button>
  </div>
</div>
