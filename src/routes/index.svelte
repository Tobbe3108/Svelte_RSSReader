<svelte:head>
  <title>Sapper RSS Reader</title>
</svelte:head>

<script>
  import { onMount } from 'svelte'

  let showAddFeed = false;
  let rssUrl = 'https://news.ycombinator.com/rss';
  let rssList = [];

  onMount(async () => {
    const newRssList = await fetch('api/list').then(r => r.json())
    rssList = newRssList
  })

  const addRssToList = async () => {
    showAddFeed = false
    const {added, rssList: newRssList} = await fetch("/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url: rssUrl })
    }).then(r => r.json())
    if (added) {
      rssList = newRssList
    }
  }

  const removeFromList = async (url) => {
    const {removed, rssList: newRssList} = await fetch("/api/del", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    }).then(r => r.json())
    if (removed) {
      rssList = newRssList
    }
  }
</script>

<style>
  .container {
    display: flex;
  }

  .feedList {
    display: flex;
    flex-direction: column;
  }

  .articles {
    display: flex;
    flex: 1;
  }

  .addFeed {
    display: flex;
    flex-direction: row;
  }

  .feedInput {
    flex: 1;
  }
</style>

{#if showAddFeed}
<div class="addFeed">
  <button on:click={() => showAddFeed = false}>Cancel</button>
  <input bind:value={rssUrl} class="feedInput" type="text" value="http://rss.feed" />
  <button on:click={addRssToList}>Add</button>
</div>
{/if}

<div class="container">
  <div class="feedList">
    <button on:click={() => showAddFeed = true}>Add</button>
    <ul>
    {#each rssList as feed} 
      <li>{feed} <button on:click={() => removeFromList(feed)}>Remove</button></li>
    {/each}
    </ul>
  </div>
  <button>Reload</button>
  <div class="articles">Content</div>
</div>
