

<select placeholder="Search words...">
  <% _.each(words, function(word) { %>
    <option value="<%- word %>"><%= word %></option>
  <% }); %>
</select>
