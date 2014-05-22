---
layout: page
title: Our Programs
group: work
---
<!--
<div class="highlighted">
	<div class="wrap">
	  <div class="region-highlighted">
	    <div class="left">
        <img src="http://placehold.it/900x400">
        <h1 class="page-title">Our Programs</h1>
      </div>
      <div class="right">
      	<div class="p2">
          <img src="http://placehold.it/450x200">
        </div>
        <div class="data">
          <span class="stat">300 million lbs</span>
          <span class="key">Of food distributed to over 3 million Texans in 2011</span>
        </div>
      </div>
	  </div>
	</div>
</div>
<div class="main">
	<div class="wrap">
    <section class="intro">
      <div class="left">
        <p>TFBN plays a statewide, coordinating role in areas too large for any one food bank. These include disaster relief, public   policy advocacy, and partnerships with statewide entities.</p>
        <p>We also help the network of 20 regional food banks to build the capacity to end hunger by managing statewide food sourcing and   purchasing programs, offering expert technical assistance and training, and spreading food bank innovations and best practices   statewide.</p>
        <a class="button primary" href="#">Learn More About How We're Leading Hunger Movement in Texas</a>
      </div>
      <div class="right">
      	<div class="subnav">
          <ul>
            <li><a href="{{ site.baseurl }}/work/programs/">Our Programs</a></li>
            <li><a href="{{ site.baseurl }}/work/leading-the-movement/">Leading the Movement</a></li>
            <li><a href="{{ site.baseurl }}/work/stregthening-our-response/">Strengthening Our Response</a></li>
          </ul>
        </div>
      </div>
    </section>
    {% for page in site.pages %}
      {% if page.layout == "program" %}
        <section>
          <div class="left hero">
            <img src="{{ site.baseurl }}/assets/images/{{ page.images.thumb }}">
          </div>
          <div class="right leadin">
          	<h2><a href="{{ site.baseurl }}{{ page.url }}">{{ page.title }}</a></h2>
            <p>{{ page.summary }}</p>
            <a class="button primary" href="{{ site.baseurl }}{{ page.url }}">Learn More</a>
          </div>
        </section>
      {% endif %}
    {% endfor %}
  </div>
</div>
<div class="crosslinks">
  <div class="how-we-help">
    <h3>1.9 million children Lived in food insecure homes in 2012</h3>
    <a class="button primary" href="{{ site.baseurl }}/work/">Learn About Hunger In Texas</a>
  </div>
  <div class="donate">
    <h3>Help us work with our partners to end hunger in Texas</h3>
    <a class="button primary" href="#">Donate Now</a>
  </div>
</div>
-->