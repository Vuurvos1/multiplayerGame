<script>
  import Chat from './Chat.svelte';
  import Canvas from './game/Canvas.svelte';
  import CanvasTools from './game/CanvasTools.svelte';
  import GameHeader from './game/GameHeader.svelte';
  import GamePlayers from './game/GamePlayers.svelte';
</script>

<style lang="scss">
  .game {
    display: grid;

    grid-template-columns: 12rem 1fr 16rem;
    grid-template-rows: auto;
    grid-template-areas:
      'gameHeader gameHeader gameHeader '
      'gameUsers gameCanvas gameChat'
      '. gameTools .';
    grid-row-gap: 1rem;
    grid-column-gap: 1rem;

    :global(.game__header) {
      grid-area: gameHeader;
    }

    :global(.game__chat) {
      grid-area: gameChat;
    }

    :global(.game__tools) {
      grid-area: gameTools;
    }

    :global(.game__Chat) {
      grid-area: gameChat;
    }

    :global(.game__players) {
      grid-area: gameUsers;
    }
  }
</style>

<section class="game">
  <GameHeader class="game__header" />
  <GamePlayers class="game__players" />
  <Canvas class="game__canvas" />
  <Chat class="game__chat" />
  <CanvasTools class="game__tools" />
</section>
