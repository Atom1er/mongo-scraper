
$(document).ready(function () {
    var scrape = $("#scrape");
    var articles_view = $("#articles-view");

    $.getJSON("/articles", function(data) {
        console.log(data);
        console.log(data.length);
        for(var i=0; i<data.length ; i++){
        var tittle = "<h4 id='title'>"+data[i].title+"</h4>";
        var overview = "<div id='summary'>"+data[i].summary+"</div>";
        var link = "<a href='"+data[i].link+"' id='link'>"+data[i].link+"</a>";
        var p = $("<div id='articles'>");
        p.append(tittle, overview, link);
        articles_view.append(p);
        }
    });

    scrape.on('click', () => {
        console.log('scrape clicked');

        $.ajax({
            method: "GET",
            url: '/api/scrape'
        })
            .then(function (data) {
                console.log(data);
                articles_view.append(data);
            })
            .catch();

        // 

        // $.get('/api/scrape', (err, res)=>{
        //     if(err) throw err;
        // });
        // $.get('/articles', (err, res)=>{
        //     if(err) throw err;
        //     articles_view.append(res);
        // });
    });

});