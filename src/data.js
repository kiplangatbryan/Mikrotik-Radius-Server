const bundle_offer = [
    {   
        name: 'okoa_bundle', 
        value: 5, 
        limit: 1
    }, 
    { 
        name: 'simple_bundle', 
        value: 10, 
        limit: 2
    }, 
    { 
        name: 'jenga_bundle', 
        value: 20, 
        limit: 5
    }, 
    { 
        name: 'fire_bundle', 
        value: 25, 
        limit: 7
    }, 
    { 
        name: 'blaze_bundle', 
        value: 30, 
        limit: 12
    },
    { 
        name: 'dedicated', 
        value: 40, 
        limit: 24
    }  
] 

module.exports = function() {
    return bundle_offer
}
