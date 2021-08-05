$(function() {
    const lang = document.documentElement.lang;

    const $progressBar = $(".progress-bar");
    const $submitButton = $("#submit-button");

    const updateProgress = function (percent) {
        $progressBar.html(percent + "%");
        $progressBar.width(percent + "%");
        $progressBar.attr("aria-valuenow", percent);
        if (percent === 100) {
            $progressBar.addClass("progress-bar-striped progress-bar-animated");
            $submitButton.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ' + (lang === "el" ? "Επεξεργασία.." : "Processing.."));
            $progressBar.html(lang === "el" ? "Παρακαλώ περιμένετε.." : "Please wait..")
        }
    }

    const showProgress = function (ajax = null) {
        $("input:text, textarea").addClass("form-control-plaintext").prop("readonly", true);
        $("input:file").prop("disabled", true);
        $submitButton.prop("disabled", true);
        $submitButton.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ' + (lang === "el" ? "Μεταφώρτωση.." : "Uploading.."));
        $progressBar.parent().removeClass("invisible");
        $progressBar.focus();
        if (ajax === null) updateProgress(100);
    }

    $.validator.addMethod("filesize", function (value, element, param) {
        let size = element.files[0].size;
        size = size / (1024 * 1024); //MB
        size = Math.round(size);

        return this.optional(element) || size <= param;
    });

    $("#submit-form").validate({
        submitHandler: function(form) {
            if (typeof FormData !== "function") {
                form.submit();
                showProgress();
                return;
            }
            $.ajax({
                url: form.action + "&ajax=1",
                data: new FormData(form),
                method: "POST",
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    showProgress(true);
                },
                uploadProgress: function (e) {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded * 100) / e.total);
                        updateProgress(percent);
                    }
                }
            })
            .always(function(data) {
                const page = JSON.parse(data).upload ? "thanks-" : "error-";
                window.location.replace(page + lang + ".html");
            })
        },
        rules: {
            area: {
                required: true
            },
            street: {
                required: true
            },
            video_file: {
                required: true
            }
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
    });

});
