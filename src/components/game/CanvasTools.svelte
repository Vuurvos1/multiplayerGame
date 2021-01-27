<script>
  import Pencil from './../icons/Pencil.svelte';
  import Erase from './../icons/Erase.svelte';
  import Undo from './../icons/Undo.svelte';
  import Bucket from './../icons/Bucket.svelte';
  import Delete from './../icons/Delete.svelte';

  import { paint } from './../../store';

  const brushColors = [
    '#FFFFFF',
    '#C1C1C1',
    '#EF130B',
    '#FF7100',
    '#FFE400',
    '#00CC00',
    '#00B2FF',
    '#231FD3',
    '#A300BA',
    '#D37CAA',
    '#A0522D',
    '#000000',
    '#4C4C4C',
    '#740B07',
    '#C23800',
    '#E8A200',
    '#005510',
    '#00569E',
    '#0E0865',
    '#550069',
    '#A75574',
    '#63300D',
  ];
  const brushSizes = [3, 5, 10, 15, 20];
  const tools = ['brush', 'erase', 'undo', 'fill', 'delete'];

  $: currentCol = brushColors[11];
  let currentTool = tools[0];
  let currentSize = brushSizes[0];
</script>

<style lang="scss">
  .tools {
    display: flex;
    flex-direction: row;

    button {
      width: 2.4rem;
      height: 2.4rem;
    }

    &__colorDisplay {
      width: 2.4rem;
      height: 2.4rem;

      margin-right: 1rem;

      background-color: hotpink;
    }

    &__colors {
      display: grid;
      // repeat half of total colors
      grid-template-columns: repeat(11, 1.2rem);
      grid-template-rows: repeat(2, 1.2rem);

      button {
        width: 100%;
        height: 100%;
      }
    }

    &__tools {
      margin: 0 auto;

      button {
        margin-right: 0.5rem;
      }
    }

    &__size {
      display: flex;
      flex-direction: row;

      button {
        display: flex;
        justify-content: center;
        align-items: center;

        margin-left: 0.5rem;
      }

      div {
        border-radius: 10rem;
        background-color: var(--black);
      }
    }
  }
</style>

<section class={`${$$props.class} tools`}>
  <div class="tools__colorDisplay" style={`background-color: ${currentCol}`} />

  <div class="tools__colors">
    {#each brushColors as color}
      <button
        data-brushColor={color}
        style={`background-color: ${color}`}
        on:click={() => {
          currentCol = color;
          $paint.selectColor = color;
        }}
      />
    {/each}
  </div>

  <div class="tools__tools">
    {#each tools as tool}
      <button
        data-tool={tool}
        on:click={() => {
          if (tool == 'undo') {
            $paint.undoMove();
            return;
          }
          $paint.activeTool = tool;
        }}
      >
        {#if tool == 'brush'}
          <Pencil />
        {:else if tool == 'erase'}
          <Erase />
        {:else if tool == 'undo'}
          <Undo />
        {:else if tool == 'fill'}
          <Bucket />
        {:else if tool == 'delete'}
          <Delete />
        {/if}
      </button>
    {/each}
  </div>

  <!-- when selecting brush size also select brush unless eraser is selected -->
  <div class="tools__size">
    {#each brushSizes as size}
      <button
        brushSize={size}
        on:click={() => {
          currentSize = size;
          $paint.lineWidth = size;
        }}
      >
        <div style={`width: ${size}px; height: ${size}px`} />
      </button>
    {/each}
  </div>
</section>
