<svelte:head>
  <title>Sapper RSS Reader</title>
</svelte:head>

<script>
  import { onMount } from 'svelte'
  import Article from '../components/Article.svelte'

  let showAddFeed = false;
  let rssUrl = 'https://news.ycombinator.com/rss';
  let rssList = [];
  let feedsContent = [];

  onMount(async () => {
    const newRssList = await fetch('api/list').then(r => r.json())
    rssList = newRssList
  })

  const refreshFeeds = async () => {
    const feeds = await fetch('api/refresh').then(r => r.json())
    feedsContent = feeds.map(feed => {
      const {items, ...feedMeta} = feed;
      return items.map(item => ({...item, feed: feedMeta}))
    })
    .reduce((acc, val) => acc.concat(val), [])
    .sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate))
  }

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
      refreshFeeds()
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
      refreshFeeds()
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
    padding: 10px;
  }

  .addFeed {
    display: flex;
    flex-direction: row;
  }

  .feedInput {
    flex: 1;
  }

  .articlesCollection {
    display: flex;
    flex: 1;
    padding: 10px;
    flex-direction: column;
  }

  .articleActions {
    display: flex;
  }

  .article {
    display: flex;
    flex-direction: column;
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

  <div class="articlesCollection">
    <div class="articleActions">
      <button on:click={refreshFeeds}>Reload</button>
    </div>
    <div class="article">
      {#each feedsContent as item}
        <Article {item}/>
      {/each}
    </div>
  </div>
</div>
