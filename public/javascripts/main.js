$(function() {
    // tests
    console.log('main.js')
    var start = moment().format('h:mm a')
    console.log('this is start ' +start)

    // see function below.  Creates a list of jobs from active shift
    appendJobs(jobData)

    var merchantList = getJSONData(merchantDict, 'Merchant')
    var categoryList = getJSONData(merchantDict, 'Category')
    //console.log(merchantDict)

    // auto complete merchant field
    $('#autocomplete-1').autocomplete({
        source: merchantList,
        autoFocus: true
    })

    // set up for modal category prompt
    var modal = $('#modal').dialog({
        autoOpen: false,
        closeOnEscape: true,
        modal: true,
        buttons: [
            {text: 'ok', click: function() {
                var cat = $('#modalCategory').val()

                $(this).dialog('close')
                console.log($('#modalCategory').val())

                $('#jobCategory').val( cat )
                $('#jobData').submit()
            }},
            {text: 'cancel', click: function() {$(this).dialog('destroy')}}

        ]

    })

    // check if merchant is in list and if not prompt user to select category
    $('#jobSubmit').on('click', function(e) {
        e.preventDefault()
        var jobMerchant = $('#jobMerchant').val()
        
        if (merchantList.indexOf(jobMerchant) === -1) {
            console.log('merchant NOT IN list')
            $('#modal').append(
                "<p id='modalText'>New merchant, please pick a category below</p>" +
                "<form id='modalForm'>" +
                    "<label for='category'>Merchant Category</label>" +
                    "<select name='category' id='modalCategory'>" +
                        "<option value='blank'></option>" +
                        "<option value='restaurant'>Restaurant</option>" +
                        "<option value='fancy restaurant'>Fancy Restaurant</option>" +
                        "<option value='fast food'>Fast Food</option>" +
                        "<option value='fancy fast food'>Fancy Fast Food</option>" +
                        "<option value='cafe'>Cafe</option>" +
                        "<option value='drinks'>Drinks</option>" +
                        "<option value='liquor'>Liquor</option>" +
                        "<option value='novelty'>Novelty</option>" +
                        "<option value='pizza'>Pizza</option>" +
                        "<option value='grocery'>Grocery</option>" +
                    "</select>"  +
                "</form>"
                
            )
            modal.dialog('open')
        }
        else {console.log('merchant IN list')
            var merchIndex = searchJSON(merchantDict, 'Merchant', jobMerchant)
            $('#jobCategory').val(merchantDict[merchIndex]['Category'])
            $('#jobData').submit()
            
        }
    })

    
    // hide tip field if tip is pending
    $('#pending').on('click', function() {
        $('#jobTip').toggle(300);
    })

    // remove job from list and from database
    $('.job-delete').on('click', function( event ) {
        $target = $(event.target)

        $.ajax({
            type: 'DELETE',
            url: '/addData/',
            data: {_id : $target.attr('jobid')},
            success: function(res) {
                $target.parent().parent().remove();
                //$alert.trigger('success', 'Task was removed.');
                },
            error: function(err) {
                //$alert.trigger('error', error);
                console.log(err)
            }
        })
    })   
})


function appendJobs(list) {
    for (var i = 0; i < list.length; i++) {
        var jobForList = list[i]
        var jobDate = moment(jobForList['jobStart']).utc().format('dd MM/DD')
        var start = moment(jobForList['jobStart']).utc().format('hh:mm a')
        var end = moment(jobForList['jobEnd']).utc(0).format('hh:mm a')
        console.log(jobForList['jobEnd'] + ', ' + end)


        $('#addedJobs > div > table > tbody').append("<tr></tr>")
        $('#addedJobs > div > table > tbody > tr:last-child').append(
            
            "<td>" +jobDate+ "</td>",
            "<td>" +jobForList['jobMerchant']+ "</td>",
            "<td>" +jobForList['jobPayout']+ "</td>",
            "<td>" +jobForList['jobTip']+ "</td>",
            "<td>" +start+ "</td>",
            "<td>" +end+ "</td>",
            "<td><button type='button' class='job-delete' jobID='"+jobForList['_id']+"'> Delete </button></td>"
        )
    }
}

// get a list of all values in JSON data

function getJSONData (data, field) {
    var list = []
    for ( var i = 0; i < data.length; i++) {
        list.push(data[i][field])
    }   
    return list
}

function searchJSON (data, key, value) {
    for (var i=0; i< data.length; i++) {
        if (data[i][key] === value) {
            return i
        }
    }
    return null
}

