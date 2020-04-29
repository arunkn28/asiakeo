$(document).on("click","a.modifQte",function(event){
    event.preventDefault();
    //console.log("click sur a.modifQte");
    
    $("div#panier_debug").html("click");
    try {
        if(!$(this).hasClass('btn-disabled'))
        {
            var type ='';
            if ($(this).hasClass('accessoire')) {
                type = "accessoire";
            }
            if ($(this).hasClass('accessoire-offert')) {
                type = "accessoire-offert";
            }

            if($(this).hasClass('has-formule') && $(this).hasClass('more'))
            {
                show_formule($(this).data("idpdt"));
            }
            else
            {
                //console.log("appel refreshquantity()");
                refreshquantity($(this).data("idpdt"), $(this).data("value"), $(this).closest("form"), type);
            }
        }
    }
    catch(e)
    {
        alert(e.message);
    }
});



// Afficher l'Overlay pour sélectionner les différents produits d'une formule
function show_formule(prod_id)
{
    $.ajax({
        url: url_root,
        type: "POST",
        data: "ajax=1&action=get_formule_fields&prod_id=" + prod_id,
        dataType: "json",
        success: function(response) {
            if(response.type == 'success')
            {
                // On remplit de DIV des différents <select> selon le produit
                $("div.overlay div#form_elements").html(response.message);

                // On affiche l'overlay
                $("div.overlay-formule").css("display","block").addClass('ov-visible');
                
                $("div.overlay-formule button#button_add_formule").val(prod_id);
                

                // Ensuite l'envoi des données se fait dans le script en dessous ("add_formule" click)
            }
            else
            {
                $.growl.error({ title: "Erreur", message: response.message });
            }
        },
        error: function(e) {
            alert(e.message);
        }
    });
}
function refreshquantity(idPdt, qte, formToSub, type) {

    if(type === 'accessoire')
    {
       var $input = $('input#accessoire-' + idPdt);
    }
    else if(type === 'accessoire-offert')
    {
       var $input = $('input#accessoire-offert-' + idPdt);
    }
    else
    {
      var $input = $('input#quantities-' + idPdt);
    }

    var  inputValue = parseInt($input.val());
    var newInput = inputValue + parseInt(qte);
    
    if(newInput < 0)
    {
        
        if(type === 'accessoire' || type === 'accessoire-offert')
        {
            $("a#btn-left-"+idPdt).addClass("btn-disabled");
        }
        
        return true;
    }
    //console.log(newInput);

    // 1, MAJ de la quantité
    //console.log("MAJ de la quantité");

    var _data;
    if(type === 'accessoire')
    {
        _data = "ajax=1&page=panier&maj_accessoires=1&accessoires[" + idPdt + "]=" + newInput;
    }
    else if(type === 'accessoire-offert')
    {
        _data = "ajax=1&page=panier&maj_accessoires_offert=1&accessoires[" + idPdt + "]=" + newInput;
    }
    else
    {
        _data = "ajax=1&page=panier&update_prods=1&quantities[" + idPdt + "]=" + newInput;
    }
    $.ajax({
        url: url_root,
        type: "POST",
        data: _data,
        dataType: "json",
        success: function(response) {
            //console.log("Appel update_panier()");
            update_panier(idPdt, newInput, response, type);
        },
        error: function(e) {
            alert(e.message);
        }
    });

    if (newInput >= 0) {
        $input.val(newInput);
        //formToSub.submit();
    }


};

// response : type JSON
var is_accessoire = is_accessoire_offert = false;
function update_panier(id, nb, response, type_element)
{
    //console.log("update_panier("+id+", "+nb+", response, "+type_element+")");
    //console.log("response = ");
    //console.log(response);

    if(response.type === "success")
    {

        var _message = response.message;
        if(response.prix_total_produit)
        {
            $("div#price-produit-" + id).html(response.prix_total_produit);
        }

        //$.growl.notice({ title: "Succès", message: _message });
        //
        // 2. Rafraichir le mini panier
        //console.log("- Rafraichir le mini panier");
        if(page === 'boutique')
        {
            //console.log("-->get_produits_panier");
            
            $.ajax({
                url: url_root,
                type: "POST",
                data: "ajax=1&action=get_produits_panier&page=" + page,
                dataType: "json",
                success: function(response) {
                    //console.log("-- Remplir le mini panier");
                    $("div#big-basket").html(response.content);
                    
                    $("header a.panier sup").html(response.nb_total);
                },
                complete:function(){
                    //console.log(".scrollbar-inner trigger");
                    $(".scrollbar-inner").trigger("contentchanged");
                }
            });
        }
        // Page Panier
        else
        {
            var is_accessoire = type_element === "accessoire";
            var is_accessoire_offert = type_element === "accessoire-offert";
            var nb_str = nb;

            if(is_accessoire_offert)
            {
                $("span#qte-offert-" + id).html(nb_str);
            }
            else
            {
                $("span#qte-" + id).html(nb_str);
            }

            if(nb === 0)
            {
                if(page === 'panier')
                {
                    if((is_accessoire === true || is_accessoire_offert === true))
                    {
                        $("a#btn-left-"+id+'.'+type_element).addClass("btn-disabled");
                    }
                    else
                    {
                        
                        /*
                        $("div#ligne-produit-"+id).fadeIn('slow', function(){
                            $(this).remove();
                        });
                        */
                        window.location.reload();
                    }
                }
            }
            else
            {
                $("a#btn-left-"+id).removeClass("btn-disabled");
            }
        
            $.ajax({
                url: url_root,
                type: "POST",
                data: "ajax=1&page=panier&action=get_panier_total_detail",
                dataType: "json",
                success: function(response) {
                    $("#panier_nb_produits").html(response.nb_produits);
                    $("#panier_nb_total").html(response.nb_total);
                    $("#panier_total_nb_pieces").html(response.total_nb_pieces);
                    $("#panier_price_total").html(response.price_total);
                    $("p.price-total-steps span").html(response.price_total);
                    $("div.price-checkout-span span").html("+" + response.price_total_accessoires);
                    
                    $("header a.panier sup").html(response.nb_total);
                    
                    var produits_offerts_str = response.produits_offerts_str;
                    if(produits_offerts_str !== '')
                    {
                        $("div#accessoires-offerts form").html(produits_offerts_str);
                        $("div#accessoires-offerts").show();
                    }
                    else
                    {
                        $("div#accessoires-offerts").hide();
                        $("div#accessoires-offerts form").empty();
                    }
                }
            });
        }
    }
    else
    {
        //$.growl.error({ title: "Erreur", message: response.message });
    }
}


// Click sur le bouton "Ajouter"
$("button.product-add").on("click", function(event) {

    event.preventDefault();

    //console.log("click sur button.product-add");


    var prod_id = $(this).val();
    // Si le produit a une formule
    if($(this).hasClass('has-formule'))
    {
        //console.log("-- show_formule("+prod_id+");");
        show_formule(prod_id);
    }
    // Produit simple sans formule
    else
    {

        var _data = "ajax=1&add=" + prod_id;



        //console.log("--> ajax : " + _data);
        $.ajax({
            url: url_panier,
            type: "POST",
            data: _data,
            dataType: "json",
            success: function(response) {
                update_panier(prod_id, 1, response);
            },
            error: function(e) {
                alert(e.message);
            }
        });
    }
    return false;
});

// Click sur le bouton "Ajouter" d'un Overlay d'une formule
$("button.add_formule").on("click", function(event) {

    event.preventDefault();

    var prod_id = $(this).val();
    var _data = "ajax=1&add=" + prod_id + "&" + $("form#form-formule").serialize();
    $.ajax({
        url: url_panier,
        type: "POST",
        data: _data,
        dataType: "json",
        success: function(response) {
            if(response.type === 'success')
            {
                update_panier(prod_id, response.nb_produits_produit, response);
                $("div.overlay-formule").removeClass('ov-visible').css("display","none");
            }
            else
            {
                $.growl.error({ title: "Erreur", message: response.message });
            }
        },
        error: function(e) {
            alert(e.message);
        }
    });
    return false;
});


$("div.overlay-formule a.direc").on("click", function(event) {
    $("div.overlay-formule").removeClass('ov-visible').css("display","none");
});

// Affichage popup CSS : "N'oubliez pas votre dessert ou votre boisson"
$("div#dessertboisson a").on("click", function(event) {

    event.preventDefault();

    var url = $(this).attr("href");

    $.ajax({
        url: url_panier,
        type: "POST",
        data: "desserboisson_choosen=1",
        dataType: "html",
        success: function(response) {
            //alert("1 : " + response);
            window.location.href = url;
        },
        error: function(e) {
            alert("2 : " + e.message);
        }
    });

});
