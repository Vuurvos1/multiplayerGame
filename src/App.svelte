<script>
  import { onMount } from 'svelte';
  import { users } from './store';

  import Game from './components/Game.svelte';
  import Lobby from './components/Lobby.svelte';
  import Profile from './components/Profile.svelte';

  import { socket, gameState } from './store';

  $socket = io.connect(window.location.host);

  // Presistent socket events (active on all screens)
  let roomId;
  $socket.on('roomValue', (data) => {
    roomId = `${window.location.origin}/?${data}`;
  });

  $socket.on('getUsers', (data) => {
    // test
    $users = data;
  });

  $socket.on('userJoin', (data) => {
    $users = [...$users, data];
  });

  $socket.on('userLeave', (data) => {
    // test
    $users = $users.filter((el) => el != data);
  });

  // $gameState = 'lobby';

  // login logic
  onMount(() => {
    console.log('🚀');

    const searchRoom = window.location.search.slice(1);
    $socket.emit('joinRoom', searchRoom);
  });
</script>

<style>
  h1 {
    font-size: 3rem;
    color: #000000;
  }

  :global(button) {
    border: none;
    cursor: pointer;
  }
</style>

<svelte:head>
  <title>Drawing Game</title>
  <html lang="en" />
</svelte:head>

<h1>Game</h1>
{#if $gameState == 'profile' || $gameState == ''}
  <!-- character creator -->
  <Profile />
{:else if $gameState == 'lobby'}
  <!-- game lobby -->
  <Lobby {roomId} />
{:else if $gameState == 'game'}
  <!-- game canvas -->
  <Game />
{/if}
