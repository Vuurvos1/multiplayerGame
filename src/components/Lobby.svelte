<script>
  import Settings from './lobby/lobbySettings.svelte';
  import Players from './lobby/players.svelte';
  import Chat from './Chat.svelte';

  export let roomId;
</script>

<style lang="scss">
  .lobby {
    display: grid;
    grid-template-columns: 22rem 1fr 16rem;
    grid-template-areas: 'settings players chat';

    :global(.lobby__settings) {
      grid-area: settings;
    }

    :global(.players) {
      grid-area: players;
    }

    :global(.lobby__chat) {
      grid-area: chat;
    }
  }
</style>

<section class="lobby">
  <Settings {roomId} class="lobby__settings" />
  <Players class="lobby__players" />
  <Chat class="lobby__chat" />
</section>
