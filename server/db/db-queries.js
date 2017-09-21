exports.GET_STATIC_CONTENT_INFO_OPEN_DATA_QUERY = 'SELECT contents row_to_json(section) ' +
                                                   'FROM (SELECT sec.title AS sectionTitle, sec.subtitle AS sectionSubtitle ' +
                                                              ', sec.description AS sectionDescription ' +
                                                              ', (SELECT array_to_json(array_agg(row_to_json(contents))) ' +
                                                                  'FROM (SELECT cnt.content_order AS contentOrder ' +
                                                                             ', cnt.title AS contentTitle, cnt.content AS contentText ' +
   	   				                                                      'FROM manager.static_contents cnt ' +
     	 			                                                     'WHERE cnt.id_section = sec.id ' +
	  				                                                     'ORDER BY cnt.content_order ASC) contents ' +
	  	                                                          ') AS sectionContents ' +
	                                                               'FROM manager.sections sec ' +
                                                                  'WHERE sec.title = $1 AND sec.subtitle = $2) section';