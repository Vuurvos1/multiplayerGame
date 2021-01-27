<script>
  import { users } from './../../store';
</script>

<style lang="scss">
  ol {
    list-style: none;
  }

  .userList {
    &__item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      &:nth-child(even) {
        background-color: var(--white);
      }

      &:nth-child(odd) {
        background-color: var(--gray200);
      }

      div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        p {
          text-align: center;
        }
      }

      img {
        width: 3rem;
        height: 3rem;
        object-fit: cover;
      }
    }
  }
</style>

<div class={$$props.class}>
  <ol class="userList">
    {#each $users as user, i}
      <li class="userList__item">
        <p>{`#${i + 1}`}</p>
        <div>
          <p>{user.username}</p>
          <p>Score: {user.score}</p>
        </div>
        <img src={`./img/userImg/user${user.image}.png`} alt="" />
      </li>
    {/each}
  </ol>
</div>
