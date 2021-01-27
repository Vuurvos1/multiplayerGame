<script>
  import Send from './icons/Send.svelte';
  import { socket } from './../store';

  let msg = '';
  $: messages = [];

  function msgSend(e) {
    e.preventDefault();

    if (msg.trim() == '') {
      return;
    }

    const data = {
      username: $socket.id,
      message: msg,
    };

    messages = [...messages, data];

    $socket.emit('message', data);

    // reset message
    msg = '';
  }

  $socket.on('message', (data) => {
    messages = [...messages, data];
  });
</script>

<style lang="scss">
  .messages {
    p {
      padding: 0.4em;

      &:nth-child(even) {
        background-color: var(--white);
      }

      &:nth-child(odd) {
        background-color: var(--gray200);
      }
    }
  }

  form {
    display: flex;
    flex-direction: row;

    input {
      width: 100%;

      padding: 0.6em;

      border: 1px solid var(--black);
      border-radius: 4px 0 0 4px;
      border-right: none;
    }

    button {
      font-size: 0;

      border: 1px solid var(--black);
      border-radius: 0 4px 4px 0;
      border-left: none;

      padding: 0.2rem;

      :global(svg) {
        height: 1.2rem;
        width: auto;
      }
    }
  }
</style>

<div class={$$props.class}>
  <div class="messages">
    {#each messages as message}
      <p>
        <b>{`${message.username}:`}</b>
        {message.message}
      </p>
    {/each}
  </div>

  <form>
    <input type="text" placeholder="message" bind:value={msg} />
    <button type="submit" on:click={msgSend}>
      Send
      <Send />
    </button>
  </form>
</div>
