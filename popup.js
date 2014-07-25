var usage, // Total usage, in GigaBytes
    package, // Users's package -> one among the list
    usageHandler,
    packageHandler,
    render,
    onError;

render = function (n) {
    if (!usage || !package) {
        return false;
    }

    document.body.classList.remove("loading");

    var consumed = document.getElementById("consumed"),
        fup = document.getElementById("fup"),
        bbMeter = document.getElementById("bb-meter");

    consumed.innerHTML = usage;
    fup.innerHTML = package.data + ' GB';
    bbMeter.innerHTML = (((package.data - usage) / package.data) * 100).toFixed(2) + "%";

    return this;
},

onError = function () {
    document.body.classList.add("error");
};

// Find and update user's package.
packageHandler = new XMLHttpRequest();
packageHandler.open("GET", "http://portal.acttv.in/index.php/mypackage", true);
packageHandler.onreadystatechange = function () {
    var div, t;

    if (this.readyState != 4) {
        return this;
    }

    if (this.status !== 200) {
        return onError("Something went wrong");
    }

    div = document.createElement("div");
    div.innerHTML = this.responseText;

    var packageName = div
        .querySelector(".moduletable tr:nth-child(3) td")
        .textContent
        .trim();

    var usageText = div
        .querySelector(".moduletable tr:nth-child(4) td")
        .textContent;

    var usageSplit = usageText.split(/\s+/);

    usage = parseFloat(usageSplit[0], 10);

    package = { 'name': packageName, 'data': usageSplit[3] }

    return render();
};
packageHandler.send();
