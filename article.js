(function() {

const newsList = document.getElementById('news');

const newsListEvents = (event) => {
    const classArray = event.target.classList;

    if(classArray.contains("comment-link")) {
        loadComments(event.target.dataset.site);
    }

    if(classArray.contains("bookmarkText")) {
        bookmarkPost(event.target.dataset.id, event.target);
    }

    event.stopPropagation();
};

newsList.addEventListener('click', newsListEvents);



/* load content */
async function getPage(url, page) {
    
    showLoadingNotification();

    const link = (url.indexOf('?') > -1) ? `${url}&page=${page}` : `${url}?page=${page}`;

    await fetch(link, {
        cache: "reload"
    })
    .then((res) => res.json())
    .then((json) => addToFeed(json))
    .then(() => removeLoadingNotification()); 
        
    states.isActive = false;

}

const showLoadingNotification = () => newsList.append(loadingNotification());

const loadingNotification = () => {
    const div = Elem('div').id("loading").class("loadingNotification").build();
    const icon = Elem("i").class("fa", "fa-spinner", "spin").build();
    div.append(icon);
    return div;
};

const removeLoadingNotification = () => document.getElementById("loading").remove();

// add new articles to the DOM
const addToFeed = (feed) => feed.map((data) => render(postTemplate(Post(data))));

// infinite load articles
window.onscroll = () => {
    let scrolled = Math.ceil(document.documentElement.scrollTop + window.innerHeight);
    let offset = document.documentElement.offsetHeight;

    if (scrolled >= offset && !states.isActive) {
        states.isActive = true;
        states.page++;
        getPage(apiFeed, states.page); 

    }
};

/* templates */
// the post type is not shown on feeds where the type is obvious                     
function canShowType(type) {
    if(typeof(type) != 'undefined'){ 
        return `
            <a href="/category/${type}" class="post-type">
                <span>${type}</span>
            </a>  
        `;
    }
    return '';
}

// generate the favicon url
const faviconUrl = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&alt=feed`;

// @param Post instance of PostLogic
function postTemplate(Post) {
  return `
    <article>
      <div class="post">
        <div class="post-text">
          <a target="_blank"
             rel="noopener"
             href="${Post.getLink()}" 
             title="Read this article" class="post-title">
            <h2>${Post.getTitle()}</h2>
          </a>
        <div class="post-snippet">
          ${Post.getSnippet()} ...
        </div>
        <div class="domainTypeContainer">
        <a href="/website/${Post.getDomain()}" 
           class="nav-link posted-from" 
           title="All articles from ${Post.getDomain()}">
          <img src="${faviconUrl(Post.getUrl())}" class="favicon">
          ${Post.getDomain()}
        </a>
        ${canShowType(Post.getType())}
      </div>
      <div>
        <i aria="hidden" class="fa fa-calendar"></i>
        <time class="post-date">
          ${Post.getDate()}
        </time>
        ${isLoggedIn ? `
        <i class="fa fa-bookmark post-bookmark"></i>
        <span 
            class="bookmarkText" 
            title="bookmark this post"
            data-id="${Post.getId()}"
        >
            bookmark
        </span>
        <span 
            class="comment-link" 
            title="comment on and share this post"
            data-site="${Post.getId()}"   
        >
        <i aria="hidden" class="fa fa-comment-o"></i>
        comment, share
        </span>`
        : ''}
      </div>
    </div>
  </article>
  `;
}   
                                      
// add post to DOM
function render(html, node = newsList) {
    const insert = Elem('div').html(html).build();
    node.appendChild(insert);
}

// reload webpage
const reload = () => location.reload();

/* live search */
const inputBox = document.getElementById('mainSearch');
const liveSearchOutput = document.getElementById("liveSearchOutput");

inputBox.addEventListener('keyup', liveSearch);

// clear live search results
const clearLiveSearch = () => liveSearchOutput.innerHTML = '';

// site live search
async function liveSearch(event) {

    if(this.value.length > 2) {
        await fetch('/rest/live-search.php?id=' + this.value)
        .then((res) => res.json())
        .then((json) => addToLiveFeed(json));
    }
    if(this.value.length < 1){
        liveSearchOutput.style.display = "none";    
    }  

}

// live search html template per result
function liveSearchTemplate(Post) {
  return `
    <div class="liveResults">
      <a href="${Post.getLink()}"
         target="_blank">
        <img class="favicon" src="${faviconUrl(Post.getUrl())}" />
        <span>${Post.getTitle()}</span>
        <span class="liveSearchDate">${Post.getDate()}</span>
      </a>    
    </div>
  `;
}

// add results to live search feed
const addToLiveFeed = (feed) => {
    clearLiveSearch();
    liveSearchOutput.style.display = "block";
    feed.map((data) => render(liveSearchTemplate(new PostLogic(data)), liveSearchOutput));
};

/* Bookmark site */
function bookmarkPost(id, element) {

  const rest = `/rest/user/bookmark.php?id=${id}`;
 
    fetch(rest)
      .then(response => response.json())
      .then(data => {
        if(data.id === 200 || data.id === 400) {
            element.innerHTML = 'saved';
        } 
    }); 

}

/* load comments */
function loadComments(id) {

  const commentUrl = `/comments/${id}`;
  fetch(commentUrl)
      .then(response => response.text())
      .then(text => showPreview(text))
      .then(function() {
          // close the preview pane functionality
          const closePreview = document.querySelector('.closePreview');
          const previewPane = document.querySelector('.preview');
          const overlay = document.querySelector('.overlay');
 
          overlay.addEventListener('click', () => removeOverlay(overlay));
          closePreview.addEventListener('click', () => removeOverlay(overlay));

          var disqus_config = function () {
              this.page.url = window.location.href;
              this.page.identifier = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
          };
          (function() {
              var d = document, s = d.createElement('script');
              s.src = 'https://cyberbitnews.disqus.com/embed.js';
              s.setAttribute('data-timestamp', +new Date());
              (d.head || d.body).appendChild(s);
          })();
      });      

}

})();
