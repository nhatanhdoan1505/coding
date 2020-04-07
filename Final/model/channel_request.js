module.exports = function (string) {
    var request = require('request')
    var ob = {
        Channel_titile: "",
        Channel_id: "",
        Channel_sub: 0,
        Channel_views: 0,
        Channel_public: '',
        Channel_image:''
    }
    request('https://www.youtube.com/user/PewDiePie/about', function (err, res, body) {
        if (err) {
            console.log("ERROR : " + err)
        } else {
            var start_string = '<h1 class="branded-page-header-title">'
            var end_string = '<span class="subscription-preferences-overlay-container">'

            var content = slice_between(body, start_string, end_string)
            var query_string = slice_between(content, 'title=', "data-sessionlink")
            var channelTitle = slice_value(query_string, '"')
            ob.Channel_titile = channelTitle

            query_string = slice_between(content, 'yt-uix-tooltip"', 'tabindex')
            query_string = query_string.slice(15)
            channelSub = slice_value(query_string, '"')
            if (channelSub.indexOf("N") == - 1 & channelSub.indexOf("Tr") == -1) {
                ob.Channel_sub = Number.channelSub
            } else {
                if (channelSub.indexOf("N") != - 1) {
                    channelSub = channelSub.slice(0, channelSub.length - 2)
                    channelSub = channelSub.replace(",", ".")
                    ob.channel_sub = (Number(channelSub)) * 1000
                } if (channelSub.indexOf("Tr") != - 1) {
                    channelSub = channelSub.slice(0, channelSub.length - 3)
                    channelSub = channelSub.replace(",", ".")
                    ob.Channel_sub = (Number(channelSub)) * 1000000
                }
            }

            query_string = slice_between(content, 'data-channel-external-id=', end_string)
            query_string = query_string.slice(26)
            var channelId = query_string.slice(0, query_string.indexOf('"'))
            ob.Channel_id = channelId

            content = slice_between(body, '<div class="about-metadata-container">', '<div class="about-actions branded-page-box-padding">')
            views = content.slice(content.indexOf('<b>') + 3, content.indexOf('</b>'))
            while (views.indexOf('.') != -1) {
                views = views.replace('.', '')
            }
            views = Number(views)
            ob.Channel_views = views

            query_string = slice_between(content, '<br/>', '</div>')
            var public = query_string.slice(49, query_string.indexOf('</span>'))
            while(public.indexOf(' ') != -1){
                public = public.replace(' ', '')
            }
            public = public.replace('thg', '-')
            public = public.replace(',', '-')
            public = public.split('-')
            var tem = public[0]
            public[0] = public[2]
            public[2] = tem
            public = public.toString()
            while(public.indexOf(',') != -1){
                public = public.replace(',', '-')
            }
            ob.Channel_public = public

            img_src = slice_between(body,'<a class="channel-header-profile-image-container spf-link"','<div class="primary-header-contents clearfix"')
            img_src = slice_between(img_src,'src="', '" title')
            img_src = img_src.slice(5)
            ob.Channel_image = img_src

            //console.log(ob)
            function slice_between(body, start_string, end_string) {
                var start = body.indexOf(start_string)
                var end = body.indexOf(end_string)
                return body.slice(start, end)
            }
            function slice_value(body, index) {
                var start = body.indexOf(index) + 1
                var end = body.lastIndexOf(index)
                return body.slice(start, end)
            }
        
        }
        var Channel = require('./channel')
        var channel = new Channel({
            Channel_titile: ob.Channel_titile,
            Channel_id: ob.Channel_id,
            Channel_sub: ob.Channel_sub,
            Channel_views: ob.Channel_views,
            Channel_public: ob.Channel_public,
            Channel_image: ob.Channel_image
        })
        channel.save(function (err) {
            if (err) {
                console.log("Save channel err" + err)
            } else {
                console.log("Save channel successful")
            }
        })
    })
}