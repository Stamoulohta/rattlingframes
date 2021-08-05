$( function () {

    const lang = document.documentElement.lang;

    const $submitButton = $( "#submit-button" );

    $.validator.addMethod( "filesize", function ( value, element, param ) {
        let size = element.files[ 0 ].size;
        size = size / ( 1024 * 1024 ); //MB
        size = Math.round( size );

        return this.optional( element ) || size <= param;
    } );

    $( "#submit-form" ).validate( {
        submitHandler: function ( form ) {
            $("#server_upload").css("display","inline-block");
            if ( typeof FormData !== "function" ) {
                form.submit();
                return;
            }
            $.ajax( {
                url: form.action,
                data: new FormData( form ),
                method: "POST",
                cache: false,
                contentType: false,
                processData: false
            } )
            .always( function ( data ) {
                
                // const page = JSON.parse( data ).upload ? "thanks-" : "error-";
                console.log({ data });
                $("#server_upload").css("display","none");
                if ( data === "thanks" ){
                    $("#server_response").css("display","inline-block");
                    form.reset();
                }
            } )
        },
        rules: {
            name: {
                required: true
            },
            area: {
                required: true
            },
            street: {
                required: true
            },
            // video_file: {
            //     required: true
            // }
        },
        messages: lang === "el" ? {
            area: {
                required: "η περιοχή που γυρίστηκε το βίντεο είναι απαραίτητη."
            },
            street: {
                required: "η οδός που γυρίστηκε το βίντεο είναι απαραίτητη."

            },
            video_file: {
                required: "παρακαλώ επιλέξτε ένα αρχείο βίντεο."
            }
        } : {
            area: {
                required: "the area this video was shot is required."
            },
            street: {
                required: "the street this video was shot is required."

            },
            video_file: {
                required: "please provide a video file."
            }
        }
    } );

} );
