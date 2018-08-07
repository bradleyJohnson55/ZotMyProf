
var map = {};
var grade = "";
var courseL = document.getElementsByClassName("course-list");
var rows = document.getElementsByTagName("tr");

// adds name to map and calls updateName()
function input(name, grade, rmpURL, row)
{
	map[name] = [grade, rmpURL, row];
	updateName(name, row);
}

// grab RMP score
function getScore(last, first, link, row)
{
	var RMPUrl = "https://www.ratemyprofessors.com" + link;

	$.get(RMPUrl, function(response) 
	{
		var grade = $(response).find(".grade").html(); 
		var name = last + ", " + first + ".";
		input(name, grade, RMPUrl, row);
	});
}

// grab RMP unique link
function getLink(last, first, row)
{
	var found = false;
	var name = last + ", " + first + ".";
	var linkID = "";
	var RMPUrl = "https://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=University+of+California+Irvine&schoolID=1074&query=+" + last;
	
	$.get(RMPUrl, function(response)
	{
		var listings = $(response).find(".listings"); // returns the 3 listings for 'armstrong'
		var children = $(listings).children();

		var names = $(listings).find(".listing-name"); // returns the 3 sub parts to see if name matches
		for (var i = 0; i < names.length; ++i)
		{
			var nameStr = $(names[i]).find(".main").text(); // whole name
			var nameSpl = nameStr.split(", ");
			var firstIni = nameSpl[1][0]; // first letter of first name

			if (first === firstIni)
			{
				found = true;
				linkID = $(children[i]).find("a").attr('href'); // <<<<---- found the muhfuckin ID!
				getScore(last, first, linkID, row);
			}
		}
		if (!found)
		{
			input(last + ', ' + first + '.', '-1', undefined, row);
		}
	});
}

// grabs all professors on page
function main()
{
	for(var i = 0; i < rows.length; ++i)
	{
		var cols = rows[i].getElementsByTagName('td');

		if (cols.length > 0)
		{
			try
			{
				var name = cols[4].innerHTML;
				names = name.split("<br>");

				for (var j = 0; j < names.length; ++j)
				{
					if (names[j] != "" && names[j] != 'STAFF')
					{
						var firstLast = names[j].split(", ");

						if (firstLast.length > 1)
						{
							last = firstLast[0];
							first = firstLast[1];
						}

						getLink(last, first[0], i);
						//map[name] = [];
						
						
					}
				}
			}
			catch(err){}
		}
		else
		{
			cols = rows[i].getElementsByTagName('tr');
			try
			{
				var newCell = rows[i].insertCell(cols.length - 1);
				newCell.innerHTML = '<strong>RMP Score</strong>';
			}
			catch(err){}
		}
	}
}

// update to HTML --- updated
function updateName(name, row)
{
	var cols = rows[row].getElementsByTagName('td');

	try
	{
		if (map[name][1] != undefined && map[name][0] != undefined)
		{
			var link = '<a href="' + map[name][1] + '" target="_blank">' + map[name][0] + '</a>';
			var newCell = rows[row].insertCell(cols.length ).innerHTML = link;
		}
		else
		{
			var newCell = rows[row].insertCell(cols.length).innerHTML = 'no data';
		}
	}
	catch(err){}
}

main();

