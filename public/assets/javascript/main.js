
$(document).ready(function () {
    var scrape = $("#scrape");
    var articles_view = $("#articles-view");
    var clear = $("#clear");
    // var save_btn = $('.save-btn');
    var saved = $("#saved");

    $.getJSON("/articles", function (data) {
        // console.log(data);
        // console.log(data.length);
        articles_view.empty();
        var head = "<span><h3>Recent Articles</h3></span>";
        articles_view.append(head);
        for (var i = 0; i < data.length; i++) {
            var tittle = "<h4 id='title'>" + data[i].title + "</h4>";
            var overview = "<div id='summary'>" + data[i].summary + "</div>";
            var link = "<a href='" + data[i].link + "' id='link'>Read Full article.</a>";
            var row = $("<div  class='row articles'>")
            var div = $("<div class='col-10'>");
            var button =$('<button type="button" data-id='+data[i]._id+' class="save-btn col-2 btn btn-success">Save</button>');
            div.append(tittle, overview, link);
            row.append(div);
            row.append(button);
            articles_view.append(row);
        }
    });

    saved.on('click', function(){
        $.getJSON("/api/saved", function(data){
            articles_view.empty();
            var head = "<span><h3>Recent Articles</h3></span>";
            articles_view.append(head);
            for (var i = 0; i < data.length; i++) {
                var tittle = "<h4 id='title'>" + data[i].title + "</h4>";
                var overview = "<div id='summary'>" + data[i].summary + "</div>";
                var link = "<a href='" + data[i].link + "' id='link'>Read Full article.</a>";
                var row = $("<div  class='row articles'>")
                var div = $("<div class='col-10'>");
                var button1 =$('<button type="button" data-id='+data[i]._id+' class="note-btn col-2 btn btn-info">note</button>');
                var button2 =$('<button type="button" data-id='+data[i]._id+' class="delete-btn col-2 btn btn-danger">Delete</button>');
                div.append(tittle, overview, link);
                row.append(div);
                row.append(button1, button2);
                articles_view.append(row);
            }
        });
    });

    scrape.on('click', () => {
        console.log('scrape clicked');

        $.ajax({
            method: "GET",
            url: '/api/scrape'
        }).then(function (data, status) {
            console.log("Data: " + data + " Status: " + status);
            alert(data);
            // articles_view.append(data);
            location.reload();

        });
    });

    clear.on('click', ()=>{
        $.ajax({
            method:"GET",
            url: "/clear"
        }).then((data, status)=>{
            console.log("Data: " + data + " Status: " + status);
            alert(data);
            location.reload();
        });
    });

    $(document).on('click', '.save-btn', function(){
        var id = $(this).attr('data-id');
        // console.log(Object.keys(id));
        console.log('id: '+id);
        $.ajax({
            method: "GET",
            url: "/api/articles/"+id+""
        }).then((res, status)=>{
            console.log(Object.keys(res));
            // console.log(res.message);
            // console.log("data: " + res + " Status: " + status);
            $.ajax({
                method: "POST",
                url: "/api/save",
                data: res
            }).then((res, status)=>{
                console.log("db response: " + res + " Status: " + status);
            });
        });
    });


});