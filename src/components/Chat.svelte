<script>
  // import Send from './icons/Send.svelte';
  import { socket, username } from './../store';
  import { beforeUpdate, afterUpdate } from 'svelte';

  let comments = [];

  // autoscroll stuff
  let div;
  let autoscroll;

  beforeUpdate(() => {
    autoscroll =
      div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
  });

  afterUpdate(() => {
    if (autoscroll) {
      div.scrollTo(0, div.scrollHeight);
    }
  });

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      const text = event.target.value;
      if (!text) return;

      const data = {
        id: $socket.id,
        username: $username,
        message: text,
      };

      comments = comments.concat(data);
      $socket.emit('message', data);

      event.target.value = '';
    }
  }
</script>

<style lang="scss">
  .chat {
    height: 20rem;
    max-height: 20rem;
    display: flex;
    flex-direction: column;
  }
  .messages {
    height: 100%;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0.25rem;
    }

    &::-webkit-scrollbar-track-piece {
      background-color: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #cbcbcb;
      outline: none;
      border: none;
      border-radius: 1rem;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: #909090;
    }

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

  .scrollable {
    flex: 1 1 auto;
    border-top: 1px solid #eee;
    margin: 0 0 0.5em 0;
    overflow-y: auto;
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

<div class={`${$$props.class} chat scrollable`}>
  <div class="messages" bind:this={div}>
    {#each comments as comment}
      <p>
        <span>{`${comment.username}: `}</span>
        {comment.message}
      </p>
    {/each}
  </div>

  <!-- change to be more progressively enchanced using post -->
  <input on:keydown={handleKeydown} placeholder="Send a Message" />
  <!-- add a send button with an arrow -->

  <!-- <form>
    <input type="text" placeholder="message" bind:value={msg} />
    <button type="submit" on:click={msgSend}>
      Send
      <Send />
    </button>
  </form> -->
</div>
