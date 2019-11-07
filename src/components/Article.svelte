<script>
    export let item;
</script>

<style>
  .item{
    display: flex;
    flex-direction: column;
    padding-bottom: 40px;
  }
  
  .itemHead {
    display: flex;
    flex-direction: row;
  }

  .itemFeed {
    padding-right: 20px;
  }

  .itemTitle {
    flex: 1;
    padding-right: 20px;
  }

  .itemContent{
    padding-Top: 0px;
  }

  .itemDate{
    padding-right: 20px;
  }
</style>

<div class="item">
    <div class="itemHead">
        <div class="itemFeed">
            <a href={item.feed.link}>{item.feed.title}</a>
        </div>
        <a class="itemTitle" href={item.link}>{item.title}</a>
        <div class="itemDate">{new Date(item.isoDate).toLocaleString()}</div>
    </div>
    <details class="itemContent">
        {#if item.contentSnippet.length > 20}
          <summary>{item.contentSnippet.slice(0, 20) + "..."}</summary>
        {:else}
          <summary>{item.contentSnippet}</summary>
        {/if}
        {@html item.content}
    </details>
</div>
