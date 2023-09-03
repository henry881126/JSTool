<template>
  <div class="add-agreement">
    <div class="add-agreement-top">
      <span class="goback" @click="backGo">
        <i class="el-icon-back"></i>
        返回
      </span>
      <span class="add-agreement-top-title">
        <span v-if="this.isEdit"
          >{{ form.userName }}{{ form.ContractName }}</span
        >
        <span v-else>创建合同</span>
      </span>
    </div>
    <div class="form-content">
      <el-form ref="form" :rules="rules" :model="form">
        <div class="add-block">
          <div class="block-title">客户基本信息</div>
          <div class="block-content">
            <div class="block-item">
              <el-form-item
                label="客户名称 "
                class="item-list"
                label-width="140px"
                prop="userName"
              >
                <el-select
                  v-model="form.userName"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入客户名称"
                  @change="handleSelectChangeEvent"
                  :remote-method="searchUserName"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.bp + '9'"
                    :label="item.name"
                    :value="item.bp"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="客户BP号 "
                class="item-list"
                label-width="140px"
                prop="userCode"
              >
                <el-input
                  placeholder="请输入客户BP号"
                  clearable
                  v-model="form.userCode"
                ></el-input>
              </el-form-item>
            </div>
            <div class="agreement-type">
              <el-form-item label="合同类型" prop="contractType">
                <el-radio-group
                  v-model="form.contractType"
                  @change="changeRadio"
                >
                  <el-radio label="3" border>直销合同</el-radio>
                  <el-radio label="2" border>代销合同</el-radio>
                  <el-radio label="1" border>代输合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div v-if="form.contractType !== '3'">
              <div class="block-item">
                <el-form-item
                  label="供应商名称 "
                  class="item-list"
                  label-width="140px"
                  prop="supplierName"
                >
                  <el-input
                    placeholder="请输入供应商名称"
                    clearable
                    v-model="form.supplierName"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="供应商简称 "
                  class="item-list"
                  label-width="140px"
                  prop="supplierAbbreviation"
                >
                  <el-input
                    placeholder="请输入供应商简称"
                    clearable
                    v-model="form.supplierAbbreviation"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="block-item">
                <el-form-item
                  label="气源来源 "
                  class="item-list"
                  label-width="140px"
                  prop="gasName"
                >
                  <el-input
                    placeholder="请输入气源来源"
                    clearable
                    v-model="form.gasName"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="是否兜底气源 "
                  class="item-list isreveal-detail"
                  label-width="140px"
                  prop="isRevealAllDetail"
                >
                  <el-radio-group v-model="form.isRevealAllDetail">
                    <el-radio label="1" border>是</el-radio>
                    <el-radio label="2" border>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <div></div>
          </div>
        </div>
        <div class="add-block">
          <div class="block-title">合同信息</div>
          <div class="block-title-subtitle">
            <span class="cirl"> </span>
            合同基本信息
          </div>
          <div class="block-content">
            <div class="block-item">
              <el-form-item
                label="合同编号 "
                class="item-list"
                label-width="140px"
                prop="ContractCode"
              >
                <el-input
                  placeholder="请输入合同编号"
                  clearable
                  v-model="form.ContractCode"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="合同名称 "
                class="item-list"
                label-width="140px"
                prop="ContractName"
              >
                <el-input
                  placeholder="请输入合同名称"
                  v-model="form.ContractName"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="合同期 "
                class="item-list"
                label-width="140px"
                prop="ContractTerm"
              >
                <el-date-picker
               placeholder="请选择合同期"
                v-model="form.ContractTerm"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="ContractTermDate"
                clearable
                >
              </el-date-picker>
              </el-form-item>
              <el-form-item
                label="签订日期 "
                class="item-list"
                label-width="140px"
                prop="ContractSignDate"
              >
                <el-date-picker
                  v-model="form.ContractSignDate"
                  type="date"
                  placeholder="请选择签订日期"
                  clearable
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div></div>
          </div>
          <div class="block-lline"></div>
          <div class="block-title-subtitle">
            <span class="cirl"> </span>
            物理接收交付信息
          </div>
          <div class="block-content">
            <div class="block-item">
              <!-- 代销合同新 -->
              <el-form-item
                label="接收点 "
                class="item-list"
                label-width="140px"
                v-if="form.contractType !== '3'"
              >
              <el-input placeholder="请输入接收点" clearable v-model="form.receivePoint"></el-input>
              </el-form-item>
              <div v-if="form.contractType !== '3'" class="item-list pressure-spot">      
                    <div class="spot-label">
                      <!-- <span class="required-icon">*</span> -->
                      接收点压力</div>
                    <div class="pressure-spot-content">
                      <el-form-item
                      label=""
                      v-if="form.contractType !== '3'"
                    >
                    <el-input-number placeholder="最小值" v-model="form.receivePressurePoint" controls-position="right"  :min="0" ></el-input-number>
                      <span class="unit pressure-spot-unit">Mpa</span>
                    </el-form-item>
                    <span class="split-spot">-</span>
                    <el-form-item
                      label=" "
                      class="second-spot"
                      v-if="form.contractType !== '3'"
                    >
                    <el-input-number placeholder="最大值" v-model="form.receivePressureMax" controls-position="right"  :min="0" ></el-input-number>
                      <span class="unit pressure-spot-unit">Mpa</span>
                    </el-form-item>
                    </div>
              </div> 
              <!-- 代销合同新end -->
              <el-form-item
                label="交付点 "
                class="item-list"
                label-width="140px"
                v-if="form.contractType !== '1'"
              >
                <el-input
                  placeholder="请输入交付点"
                  clearable
                  v-model="form.deliveryPoint"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="产权分界点 "
                class="item-list"
                label-width="140px"
              >
                <el-input
                  placeholder="请输入产权分界点"
                  clearable
                  v-model="form.cqDividingPoint"
                ></el-input>
              </el-form-item>
              <div v-if="form.contractType !== '1'" class="item-list pressure-spot">
                    <div class="spot-label">
                      <!-- <span class="required-icon">*</span> -->
                      交付点压力</div>
                    <div class="pressure-spot-content">
                        <el-form-item
                        label=" "
                        v-if="form.contractType !== '1'"
                      >
                       <el-input-number placeholder="最小值" v-model="form.deliveryPointPressure" controls-position="right"  :min="0" ></el-input-number>
                      <span class="unit pressure-spot-unit">Mpa</span>
                    </el-form-item>
                    <span class="split-spot">-</span>
                    <el-form-item
                      label=" "
                      class="second-spot"
                      v-if="form.contractType !== '1'"
                    >
                     <el-input-number placeholder="最大值" v-model="form.deliverPressureMax" controls-position="right"  :min="0" ></el-input-number>
                      <span class="unit pressure-spot-unit">Mpa</span>
                    </el-form-item>
                    </div>
              </div>
              <el-form-item
                label="计量方式 "
                class="item-list"
                label-width="140px"
              >
                <el-select
                  clearable
                  v-model="form.meteringMode"
                  placeholder="请选择计量方式"
                >
                  <el-option
                    v-for="item in meteringModeList"
                    :key="item.value + '8'"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div></div>
          </div>
          <div class="block-lline"></div>
          <!-- 计量结算信息 -->
          <div class="block-title-subtitle">
            <span class="cirl"> </span>
            计量结算信息
          </div>
          <div class="block-content">
            <div class="block-item">
              <el-form-item
                label="结算方式 "
                class="item-list"
                label-width="140px"
              >
                <el-select
                  clearable
                  v-model="form.settlementStyle"
                  placeholder="请选择结算方式"
                >
                  <el-option
                    v-for="item in receivePointList"
                    :key="item.value + '7'"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                label="结算周期 "
                class="item-list"
                label-width="140px"
                prop="settlementPeriod"
              >
                <el-input
                  placeholder="请选择结算周期12"
                  clearable
                  v-show="false"
                  v-model="form.settlementPeriod"
                ></el-input>
                <settlementPeriod
                  v-if="expirationCycleshow1"
                  :key="temp2 + '5'"
                  @MonthObj="MonthObj"
                  @weekObj="weekObj"
                  @monthOrweek="monthOrweek"
                  :settlementPeriod1="settlementPeriod1"
                  :settlementPeriodType="form.settlementPeriodType"
                ></settlementPeriod>
              </el-form-item>
              <el-form-item
                label="结算日 "
                class="item-list"
                label-width="140px"
                prop="settlementDay"
              >
                <el-select
                  v-model="form.settlementDay"
                  multiple
                  placeholder="请选择结算日"
                >
                  <el-option
                    clearable
                    v-for="item in monthSubmitTimeList1"
                    :key="item.value + 'm'"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="交割周期 "
                class="item-list"
                label-width="140px"
                prop="expirationCycle"
              >
                <el-input
                  placeholder="请输入交割周期"
                  clearable
                  v-show="false"
                  v-model="form.expirationCycle"
                ></el-input>
                <expirationCycle
                  v-if="expirationCycleshow"
                  @dayObj="dayObj"
                  :key="temp1 + 'k'"
                  :expirationCycleO="expirationCycleO"
                ></expirationCycle>
              </el-form-item>
              <!-- 代销增 -->
              <el-form-item
                label="偏差结算率 "
                class="item-list"
                label-width="140px"
                v-if="form.contractType !== '3'"
              >
                <el-input-number
                  placeholder="请输入偏差结算率"
                  v-model="form.deviationSettlementRate"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
                <span class="unit">%</span>
              </el-form-item>
              <!-- 代销增end -->
              <el-form-item
                label="超提范围比率 "
                class="item-list"
                label-width="140px"
              >
                <el-input-number
                  placeholder="请输入超提范围比率"
                  v-model="form.overdraftRatio"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item
                label="欠提范围比率 "
                class="item-list"
                label-width="140px"
              >
                <el-input-number
                  placeholder="请输入欠提范围比率"
                  v-model="form.outstandingRatio"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
                <span class="unit">%</span>
              </el-form-item>

              <el-form-item
                label="欠提清零天数/月 "
                class="item-list outstandingClearS"
                label-width="140px"
                prop="outstandingClear"
              >
                <el-input-number
                  placeholder="请输入欠提清零天数/月"
                  v-model="form.outstandingClear"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
                <el-select
                  class="outstandingClearC"
                  v-model="form.outstandingClearC"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in outstandingClearL"
                    :key="item.value + 'l'"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="供销差率"
                class="item-list"
                label-width="140px"
                prop="DepartmenRate"
              >
                <el-input-number
                  placeholder="请输入供销差率"
                  v-model="form.DepartmenRate"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
                <span class="unit">%</span>
              </el-form-item>
            </div>
            <div></div>
          </div>
          <div class="block-lline"></div>
          <!-- 计划管理周期 -->
          <div class="block-title-subtitle">
            <span class="cirl"> </span>
            计划管理周期
          </div>
          <div class="block-content">
            <div class="block-item">
              <el-form-item
                label="月指定提交时间 "
                class="item-list"
                label-width="140px"
              >
                <el-select
                  clearable
                  v-model="form.monthSubmitTime"
                  placeholder="请选择月指定提交时间"
                >
                  <el-option
                    v-for="item in monthSubmitTimeList"
                    :key="item.value + 'a'"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="月指定批复时间 "
                class="item-list"
                label-width="140px"
              >
                <el-select
                  clearable
                  v-model="form.monthReplayTime"
                  placeholder="请选择月指定批复时间"
                >
                  <el-option
                    v-for="item in monthSubmitTimeList"
                    :key="item.value + 'g'"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="日指定提交时间 "
                class="item-list"
                label-width="140px"
              >
                <el-select
                  clearable
                  v-model="form.daySubmitTime"
                  placeholder="请选择日指定提交时间"
                >
                  <el-option
                    v-for="item in monthSubmitTimeListDay"
                    :key="item.value + 'a'"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="日指定批复时间 "
                class="item-list"
                label-width="140px"
                clearable
              >
                <el-select
                  clearable
                  v-model="form.dayReplayTime"
                  placeholder="请选择日指定批复时间"
                >
                  <el-option
                    v-for="item in monthSubmitTimeListDay"
                    :key="item.value + 'a'"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="日指定变更时间 "
                class="item-list"
                label-width="140px"
              >
                <el-select
                  clearable
                  v-model="form.dayChangeTime"
                  placeholder="请选择日指定变更时间"
                >
                  <el-option
                    v-for="item in monthSubmitTimeListDay"
                    :key="item.value + 'a'"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="月最大提取率 "
                class="item-list"
                label-width="140px"
              >
                <el-input-number
                  placeholder="请输入月最大提取率"
                  v-model="form.monthMaxRate"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
                <span class="unit">%</span>
              </el-form-item>

              <el-form-item
                label="月最小提取率 "
                class="item-list"
                label-width="140px"
              >
                <el-input-number
                  placeholder="请输入月最小提取率"
                  v-model="form.monthMinRate"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item
                label="日最大提取率"
                class="item-list"
                label-width="140px"
                prop="dayMaxRate"
              >
                <el-input-number
                  placeholder="请输入日最大提取率"
                  v-model="form.dayMaxRate"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
                <span class="unit">%</span>
              </el-form-item>
              <el-form-item
                label="日最小提取率"
                class="item-list"
                label-width="140px"
              >
                <el-input-number
                  placeholder="请输入日最小提取率"
                  v-model="form.dayMinRate"
                  controls-position="right"
                  :min="0"
                ></el-input-number>
                <span class="unit">%</span>
              </el-form-item>
            </div>
            <div></div>
          </div>
          <div class="block-lline"></div>
          <div class="block-title-subtitle">
            <span class="cirl"> </span>
            备注
          </div>
          <el-form-item label="" class="remarkC">
            <el-input
              type="textarea"
              placeholder="请输入备注"
              maxlength="500"
              show-word-limit
              clearable
              :rows="3"
              v-model="form.remark"
            ></el-input>
          </el-form-item>
        </div>
        <div class="add-block">
           <div class="table-message">
            <div class="table-top">
              <div class="block-title">合同量价信息</div>
              <div class="uploadDown">
                <div class="button" @click="exportExcel">
                  <i class="el-icon-download"></i>
                  下载合同气量模板
                </div>
                <div class="button">
                  <el-upload
                    class="upload-demo"
                    name="uploadFile"
                    action="/dongwan/contract/import-excel"
                    :on-change="uploadHandle"
                    :on-success="handleAvatarSuccess1"
                    :on-error="handleAvatarError"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                  >
                    <span>
                      <i class="el-icon-upload2"></i>导入合同气量模板</span
                    >
                    <div slot="tip" class="el-upload__tip"></div>
                  </el-upload>
                </div>
              </div>
            </div>
            <div class="table" :key="tableTemp + 'c'">
              <el-table
                class="custom-table-n custom-table"
                header-row-class-name="custom-table-header"
                header-cell-class-name="custom-table-header-cell"
                cell-class-name="custom-table-cell"
                :data="tableData22.dataList"
                style="width: 100%"
              >
                <el-table-column
                  prop="date"
                  label="合同量构成"
                  width="150"
                  fixed="left"
                >
                </el-table-column>
                <el-table-column
                  v-for="(item, index) in tableData22.theadList.slice(1)"
                  :key="index + 'qq'"
                  prop=""
                  :label="item.label"
                  align="center"
                >
                  <el-table-column
                    v-for="oneConf in item.children"
                    :key="oneConf.prop + 'jj2'"
                    :prop="oneConf.prop"
                    :label="oneConf.label"
                    min-width="130px"
                  >
                    <template slot-scope="scope">
                      
                      <el-input-number
                        @blur="jisuanAll"
                        v-model="scope.row[oneConf.prop]"
                        controls-position="right"
                        @change="handleChangeNumber"
                        :min="0"
                      ></el-input-number>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  prop="all"
                  label="总气量"
                  width="150"
                  fixed="right"
                > 
                <template slot-scope="scope">
                    <el-form-item class="table-form-cun" prop="contractDetailAmount" v-if="!scope.row.isShow"    :rules="flagAll?rules.allnumber1:rules.allnumber2">
                      <el-input-number               
                        v-model="scope.row.all"
                        controls-position="right"
                        :min="0"
                        @blur="allChangeN"
                        @change="allChangeN"
                      ></el-input-number>
                       </el-form-item>
                    </template>
                </el-table-column>
              </el-table>
            </div>
            <template v-if="form.contractType === '2'">
              <!-- 接收点价格 -->
              <div class="block-title-subtitle">
                <span class="cirl"> </span>
                接收点价格
              </div>
              <div class="block-content">
                <div class="block-item">
                  <el-form-item
                    label="冬季价格"
                    class="item-list"
                    label-width="120px"
                    v-if="form.contractType === '2'"
                    prop="receivePriceWinter"
                  >
                    <el-input-number
                      placeholder="请输入接收点冬季价格"
                      oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){value=value.slice(0,value.length-1)} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                      v-model="form.receivePriceWinter"
                      controls-position="right"
                      :min="0"
                    ></el-input-number>
                    <span class="unit">元/方</span>
                  </el-form-item>
                  <el-form-item
                    label="夏季价格"
                    class="item-list"
                    label-width="120px"
                    v-if="form.contractType === '2'"
                    prop="receivePriceSummer"
                  >
                    <el-input-number
                      oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){value=value.slice(0,value.length-1)} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                      placeholder="请输入接收点夏季价格"
                      v-model="form.receivePriceSummer"
                      controls-position="right"
                      :min="0"
                    ></el-input-number>
                    <span class="unit">元/方</span>
                  </el-form-item>
                </div>
                <div></div>
              </div>
              <div class="block-lline"></div>
              <!-- 交付点价格 -->
              <div class="block-title-subtitle">
                <span class="cirl"> </span>
                交付点价格
              </div>
              <div class="block-content">
                <div class="block-item">
                  <el-form-item
                    label="冬季价格"
                    class="item-list"
                    label-width="120px"
                    v-if="form.contractType === '2'"
                    prop="deliverPriceWinter"
                  >
                    <el-input-number
                      oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){value=value.slice(0,value.length-1)} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                      placeholder="请输入交付点冬季价格"
                      v-model="form.deliverPriceWinter"
                      controls-position="right"
                      :min="0"
                    ></el-input-number>
                    <span class="unit">元/方</span>
                  </el-form-item>
                  <el-form-item
                    label="夏季价格"
                    class="item-list"
                    label-width="120px"
                    v-if="form.contractType === '2'"
                    prop="deliverPriceSummer"
                  >
                    <el-input-number
                      oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){value=value.slice(0,value.length-1)} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                      placeholder="请输入交付点夏季价格"
                      v-model="form.deliverPriceSummer"
                      controls-position="right"
                      :min="0"
                    ></el-input-number>
                    <span class="unit">元/方</span>
                  </el-form-item>
                </div>
                <div></div>
              </div>
            </template>
            <div v-if="form.contractType == '1'">
              <div class="block-content">
                <div class="block-item">
                  <el-form-item
                    label="输配价格"
                    class="item-list"
                    label-width="120px"
                    v-if="form.contractType === '1'"
                    prop="transmissionPrice"
                  >
                    <el-input-number
                      oninput="if(isNaN(value)) { value = parseFloat(value) }if(value>10000){value=value.slice(0,value.length-1)} if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
                      placeholder="请输入输配价格"
                      v-model="form.transmissionPrice"
                      controls-position="right"
                      :min="0"
                    ></el-input-number>
                    <span class="unit">元/方</span>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="add-block">
          <div class="block-title">上传附件(可上传{{ fileListLengt }}/5)</div>
          <div class="upload-list">
            <el-upload
              class="upload-demo"
              :action="uploadProxyConfig"
              :on-change="handleChange"
              :on-remove="onremove"
              :on-success="handleAvatarSuccess"
              :file-list="fileList"
              :limit="5"
              :headers="headers"
            >
              <el-button
                v-if="fileListLengt < 5"
                size="small"
                type="primary"
                class="uploadBtn"
                ><i class="el-icon-upload2"></i> 点击上传</el-button
              >
            </el-upload>
          </div>
        </div>
      </el-form>
    </div>
    <div class="submitBtn">
      <div class="bottom-btn">
        <el-button
          type=""
          class="save"
          round
          @click="saveBtn('', '2')"
          v-if="!this.isEdit"
          >暂存</el-button
        >
        <el-button
          type="primary"
          round
          class="submit"
          @click="submitBtn('form', 1)"
          >提交</el-button
        >
      </div>
    </div>
    <el-dialog
      title="提示"
      width="30%"
      :visible.sync="isEditConstrct"
      :key="editTimer + 'h'"
    >
      <div class="set-detail confirmbtn deleteL">
        <div class="confirmbtn-content">
          <span
            >您于{{ contractDetail.createDate }} 暂存了【{{
              contractDetail.customerName
            }}】的合同信息，点选创建新合同，会将暂存的合同信息清除，是否继续编辑该合同？</span
          >
        </div>
        <div>
          <div class="set-detail-btn right">
            <el-button round @click="consoleSave" class="consoleBtn">
              创建新合同
            </el-button>
            <el-button
              type="primary"
              round
              @click="delBtnConfirm"
              class="createBtn"
            >
              继续编辑
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      width="30%"
      :visible.sync="submitSuccess"
      :key="editTimer + 'e'"
    >
      <div class="set-detail confirmbtn deleteL">
        <div class="confirmbtn-content">
          <span>客户"{{ submitSuccessName }}"提交成功</span>
        </div>
        <div>
          <div class="set-detail-btn right">
            <el-button
              type="primary"
              round
              @click="submitSuccessBtn"
              class="createBtn"
            >
              确定
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from "/src/http/api";
import topMenu from "../../components/topMenu/topMenu";
import exportApi from "/src/components/export/export";
import changeMonth from "./component/changeMonth";
import dongguanApi from "/src/http/dongguan";
import expirationCycle from "./component/expirationCycle";
import settlementPeriod from "./component/settlementPeriod";
import config from "../../config/config";
import { getCusYear, getCusYear1, publicLableValueC } from "./utils/commen";
export default {
  name: "PurchaseAnalysiss",
  mixins: [exportApi],
  components: {
    topMenu,
    changeMonth,
    expirationCycle,
    settlementPeriod,
  },
  props: ["getContractID", "isEdit"],
  data() {
    return {
      flagAll:false,//总量是否校验大于0
      tableTemp: 99,
      options: [],
      uploadProxyConfig: config.uploadProxy + "fdfs/upload",
      submitSuccess: false,
      editTimer: 1,
      expirationCycleshow: false,
      expirationCycleshow1: false,
      temp1: 2,
      temp2: 32,
      deliveryCycle: "", //交割周期选择
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("DONGGUAN_Token"),
      },
      expirationCycleListType: [
        {
          label: "本日",
          value: "1",
        },
        {
          label: "次日",
          value: "2",
        },
      ],
      monthSubmitTimeList1: [
        {
          value: "1",
          label: "1日",
        },
        {
          value: "2",
          label: "2日",
        },
        {
          value: "3",
          label: "3日",
        },
        {
          value: "4",
          label: "4日",
        },
        {
          value: "5",
          label: "5日",
        },
        {
          value: "6",
          label: "6日",
        },
        {
          value: "7",
          label: "7日",
        },
        {
          value: "8",
          label: "8日",
        },
        {
          value: "9",
          label: "9日",
        },
        {
          value: "10",
          label: "10日",
        },
        {
          value: "11",
          label: "11日",
        },
        {
          value: "12",
          label: "12日",
        },
        {
          value: "13",
          label: "13日",
        },
        {
          value: "14",
          label: "14日",
        },
        {
          value: "15",
          label: "15日",
        },
        {
          value: "16",
          label: "16日",
        },
        {
          value: "17",
          label: "17日",
        },
        {
          value: "18",
          label: "18日",
        },
        {
          value: "19",
          label: "19日",
        },
        {
          value: "20",
          label: "20日",
        },
        {
          value: "21",
          label: "21日",
        },
        {
          value: "22",
          label: "22日",
        },
        {
          value: "23",
          label: "23日",
        },
        {
          value: "24",
          label: "24日",
        },
        {
          value: "25",
          label: "25日",
        },
        {
          value: "26",
          label: "26日",
        },
        {
          value: "27",
          label: "27日",
        },
        {
          value: "28",
          label: "28日",
        },
        {
          value: "29",
          label: "29日",
        },
        {
          value: "30",
          label: "30日",
        },
        {
          value: "31",
          label: "31日",
        },
      ],
      monthSubmitTimeListDay: [
        {
          label: "每日0:00",
          value: "1",
        },
        {
          label: "每日1:00",
          value: "2",
        },
        {
          label: "每日2:00",
          value: "3",
        },
        {
          label: "每日3:00",
          value: "4",
        },
        {
          label: "每日4:00",
          value: "5",
        },
        {
          label: "每日5:00",
          value: "6",
        },
        {
          label: "每日6:00",
          value: "7",
        },
        {
          label: "每日7:00",
          value: "8",
        },
        {
          label: "每日8:00",
          value: "9",
        },
        {
          label: "每日9:00",
          value: "10",
        },
        {
          label: "每日10:00",
          value: "11",
        },
        {
          label: "每日11:00",
          value: "12",
        },
        {
          label: "每日12:00",
          value: "13",
        },
        {
          label: "每日13:00",
          value: "14",
        },
        {
          label: "每日14:00",
          value: "15",
        },
        {
          label: "每日15:00",
          value: "16",
        },
        {
          label: "每日16:00",
          value: "17",
        },
        {
          label: "每日17:00",
          value: "18",
        },
        {
          label: "每日18:00",
          value: "19",
        },
        {
          label: "每日19:00",
          value: "20",
        },
        {
          label: "每日20:00",
          value: "21",
        },
        {
          label: "每日21:00",
          value: "22",
        },
        {
          label: "每日22:00",
          value: "23",
        },
        {
          label: "每日23:00",
          value: "24",
        },
      ],
      monthSubmitTimeList: [
        {
          value: "1",
          label: "每月1日",
        },
        {
          value: "2",
          label: "每月2日",
        },
        {
          value: "3",
          label: "每月3日",
        },
        {
          value: "4",
          label: "每月4日",
        },
        {
          value: "5",
          label: "每月5日",
        },
        {
          value: "6",
          label: "每月6日",
        },
        {
          value: "7",
          label: "每月7日",
        },
        {
          value: "8",
          label: "每月8日",
        },
        {
          value: "9",
          label: "每月9日",
        },
        {
          value: "10",
          label: "每月10日",
        },
        {
          value: "11",
          label: "每月11日",
        },
        {
          value: "12",
          label: "每月12日",
        },
        {
          value: "13",
          label: "每月13日",
        },
        {
          value: "14",
          label: "每月14日",
        },
        {
          value: "15",
          label: "每月15日",
        },
        {
          value: "16",
          label: "每月16日",
        },
        {
          value: "17",
          label: "每月17日",
        },
        {
          value: "18",
          label: "每月18日",
        },
        {
          value: "19",
          label: "每月19日",
        },
        {
          value: "20",
          label: "每月20日",
        },
        {
          value: "21",
          label: "每月21日",
        },
        {
          value: "22",
          label: "每月22日",
        },
        {
          value: "23",
          label: "每月23日",
        },
        {
          value: "24",
          label: "每月24日",
        },
        {
          value: "25",
          label: "每月25日",
        },
        {
          value: "26",
          label: "每月26日",
        },
        {
          value: "27",
          label: "每月27日",
        },
        {
          value: "28",
          label: "每月28日",
        },
        {
          value: "29",
          label: "每月29日",
        },
        {
          value: "30",
          label: "每月30日",
        },
        {
          value: "31",
          label: "每月31日",
        },
      ],
      outstandingClearL: [
        {
          value: "1",
          label: "日",
        },
        {
          value: "2",
          label: "月",
        },
      ],
      receivePointList: [
        {
          value: "1",
          label: "标方结算",
        },
        {
          value: "2",
          label: "能量结算",
        },
      ],
      //   计量方式
      meteringModeList: [
        {
          value: "1",
          label: "体积",
        },
        {
          value: "2",
          label: "能量",
        },
      ],
      form: {
        contractDetailAmount:'',//每月明细汇总气量
        userName: "", //客户名称
        userCode: "", //客户bp号
        contractType: "3",
        supplierName: "", //供应商名称
        supplierAbbreviation: "", //供应商简称
        gasName: "", //气源名称
        isRevealAllDetail: "", //是否兜底气源
        //    合同基本信息
        ContractCode: "", //合同编号
        ContractName: "", //合同名称
        yearAllNum: "", //年合同总量
        ContractTerm: [], //合同期
        ContractSignDate: "", //签订日期
        //  物理接收交付信息
        receivePoint: "", //接收点 --代销合同
        receivePressurePoint: undefined, //接收压力点最小值  --代销合同
        receivePressureMax:undefined,//接收压力点最大值
        deliveryPoint: "", //交付点
        cqDividingPoint: "", //产权分界点
        deliveryPointPressure: undefined, //交付点压力最小值
        deliverPressureMax:undefined,//交付点压力最大值
        meteringMode: "", //计量方式
        // 计量结算信息
        settlementStyle: "", //结算方式
        settlementPeriod: "", //结算周期
        settlementDay: [], //结算日
        expirationCycle: "", //交割周期
        expirationCycleStartTime: "", //交割开始时间
        expirationCycleEndTime: "", //交割结束时间
        deviationSettlementRate: undefined, //偏差结算率  ---代销合同
        overdraftRatio: undefined, //超提范围比率
        outstandingRatio: undefined, //欠提范围比率
        outstandingClear: undefined, //欠提清零天数/月
        outstandingClearC: "1", //欠提清零天数/月类型
        transmissionPrice: "", //输配价格  ==代输合同
        DepartmenRate: undefined, //供销差率
        // 计划管理周期
        monthSubmitTime: "", //月指定提交时间
        monthReplayTime: "", //月指定批复时间
        daySubmitTime: "", //日指定提交时间
        dayReplayTime: "", //日指定批复时间
        dayChangeTime: "", //日指定变更时间
        monthMaxRate: undefined, //月最大提取率
        monthMinRate: undefined, //月最小提取率
        dayMaxRate: undefined, //日最大提取率
        dayMinRate: undefined, //日最小提取率
        remark: "",
        settlementPeriodType: "",
        receivePriceSummer: "", //接收点夏季价格
        receivePriceWinter: "", //接收点冬季价格
        deliverPriceSummer: "", //交付点夏季价格
        deliverPriceWinter: "", //交付点冬季价格
      },
      rules: {
        allnumber1:[{ required: true, message: "请输入总气量", trigger: "blur" },
        { pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message: "总气量必须大于0",trigger: "blur"},],
         allnumber2:[{ required: true, message: "请输入总气量", trigger: "blur" },],
        userName: [{ required: true, message: "请输入客户名称", trigger: "blur" },],
        userCode: [{ required: true, message: "请输入客户BP号", trigger: "blur" },],
        contractType: [{ required: true, message: "请选择合同类型", trigger: "blur" },],
        supplierName: [{ required: true, message: "请输入供应商名称", trigger: "blur" },],
        supplierAbbreviation: [{ required: true, message: "请输入供应商简称", trigger: "blur" },],
        gasName: [{ required: true, message: "请输入气源来源", trigger: "blur" },],
        isRevealAllDetail: [{ required: true, message: "请选择是否兜底合同", trigger: "change" },],
        ContractCode: [{ required: true, message: "请输入合同编号", trigger: "blur" },],
        ContractName: [{ required: true, message: "请输入合同名称", trigger: "blur" },],
        yearAllNum: [{ required: true, message: "请输入分月合同气量", trigger: "blur" },],
        ContractTerm: [{ required: true, message: "请选择合同期", trigger: "blur" },],
        ContractSignDate: [{ required: true, message: "请选择合同签订日期", trigger: "blur" },],
        receivePoint: [{ required: true, message: "请填写接收点", trigger: "blur" },],
        receivePressurePoint: [{ required: true, message: "请填写最小值", trigger: "blur" },],
        receivePressureMax:[{required: true, message: "请填写最大值", trigger: "blur" },],
        settlementDay: [{ required: true, message: "请选择结算日", trigger: "change" },],
        cqDividingPoint: [
          { required: true, message: "请输入产权分界点", trigger: "blur" },
          { max: 50, message: "长度在不得超过50个字", trigger: "blur" },
        ],
        deliveryPoint: [ { required: true, message: "请输入交付点", trigger: "blur" },],
        deliveryPointPressure: [{ required: true, message: "请输入最小值", trigger: "blur" },],
        deliverPressureMax: [{ required: true, message: "请输入最大值", trigger: "blur" },],
        meteringMode: [{ required: true, message: "请选择计量方式", trigger: "change" },],
        settlementStyle: [ { required: true, message: "请选择结算方式", trigger: "change" },],
        settlementPeriod: [{ required: true, message: "请选择结算周期", trigger: "change" },],
        expirationCycle: [{ required: true, message: "请选择交割周期", trigger: "change" },],
        deviationSettlementRate: [ { required: true, message: "请输入偏差结算率", trigger: "blur" },],
        overdraftRatio: [ { required: true, message: "请输入超提范围比率", trigger: "blur" },],
        outstandingRatio: [{ required: true, message: "请输入欠提范围比率", trigger: "blur" },],
        outstandingClear: [{ required: true, message: "请输入欠提清零天数/月", trigger: "blur" },],
        transmissionPrice: [{ required: true, message: "请输入输配价格", trigger: "blur" },],
        DepartmenRate: [{ required: true, message: "请输入供销差率", trigger: "blur" },],
        monthSubmitTime: [{ required: true, message: "请选择月指定提交时间", trigger: "blur" },],
        monthReplayTime: [{ required: true, message: "请选择月指定批复时间 ", trigger: "blur" },],
        daySubmitTime: [{ required: true,message: "请选择日指定提交时间  ",trigger: "blur",},],
        dayReplayTime: [{ required: true, message: "请选择日指定批复时间  ", trigger: "blur",},],
        dayChangeTime: [{ required: true, message: "请选择日指定变更时间", trigger: "blur" },],
        monthMaxRate: [{ required: true, message: "请输入月最大提取率", trigger: "blur" },],
        monthMinRate: [
          { required: true, message: "请输入月最小提取率", trigger: "blur" },
          { pattern: /^[0-9|^\\.]/, message: "不能为负数"},
        ],
        dayMaxRate: [{ required: true, message: "请输入日最大提取率", trigger: "blur" },],
        dayMinRate: [{ required: true, message: "请输入日最小提取率", trigger: "blur" },],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
        receivePriceSummer: [{ required: true, message: "请输入接收点夏季价格", trigger: "blur" },], //
        receivePriceWinter: [{ required: true, message: "请输入接收点冬季价格", trigger: "blur" },],
        deliverPriceSummer: [{ required: true, message: "请输入交付点夏季价格", trigger: "blur" }],
        deliverPriceWinter: [{ required: true, message: "请输入交付点冬季价格", trigger: "blur" }],
      },
      // 上传的文件
      contractFiles: [],
      fileList: [],
      tableData22: {
        dataList: [],
        theadList: [
          {
            label: "",
            prop: "date",
          },
        ],
      },
      settlementPeriod1: "",
      submitSuccessName: "", //
      changeTableData: [],
      yearTableData: [],
      contractDetail: [],
      formData: {},
      expirationCycleO: {
        deliveryCycleBegin: "",
        deliveryCycleEnd: "",
        deliveryCycleTypeR: "",
        deliveryCycleTypeL: "",
      },
      settlementPeriodMonth: {}, //结算周期月选择数据
      settlementPeriodWeek: {}, //结算周期双周选择数据
      isEditConstrct: false,
      fileListLengt: 0,
      isSubmitB: false,
      getContractId: this.getContractID,
    };
  },
  computed: {
    curComCode: function () {
      return this.$store.getters.curCom;
    },
    curComCodeName: function () {
      return this.$store.getters.curComName;
    },
    loginName: function () {
      return this.$store.getters.loginName;
    },
    curComInfo: function () {
      return this.$store.getters.curComInfo;
    },
    userInfo: function () {
      return this.$store.getters.userInfo;
    },
  },
  watch: {
    curComCode: {
      immediate: true,
      handler: function (n, o) {
        if (n && o) {
        }
      },
    },
    "form.contractType": {
      handler(newName, oldName) {
        this.tableTemp++;
      },
    },
  },
  created() {
    //   判断是否为编辑，如果是调用回显接口
    if (this.isEdit) {
      this.contractGet();
    } else {
      this.getContractId = "";
      this.contractFindUnSubmitContract();
    }
  },
  mounted() {
    this.expirationCycleshow = true;
    this.expirationCycleshow1 = true;
  },
  methods: {
    // 获取交割周期选择
    dayObj(val) {
      this.deliveryCycle = val;
      console.log(this.deliveryCycle)
      if (this.deliveryCycle.typeL && this.deliveryCycle.typeR) {
        if(this.deliveryCycle.valueL){
        this.form.expirationCycle = publicLableValueC( this.expirationCycleListType,  this.deliveryCycle.typeL) +
          "" +
          this.deliveryCycle.valueL +
          publicLableValueC(
            this.expirationCycleListType,
            this.deliveryCycle.typeR
          ) + this.deliveryCycle.valueR;
          }
      }
    },
    // 获取结算周期月选择数据
    MonthObj(val) {
      this.settlementPeriodMonth = val;
    },
    weekObj(val) {
      this.settlementPeriodWeek = val;
      if (this.form.settlementPeriodType == "3") {
        let typeL = "";
        let typeR = "";
        if (
          this.settlementPeriodMonth.typeL &&
          this.settlementPeriodMonth.typeL == "1"
        ) {
          typeL = "本月";
        } else {
          typeL = "上月";
        }
        if (
          this.settlementPeriodMonth.typeR &&
          this.settlementPeriodMonth.typeR == "1"
        ) {
          typeR = "本月";
        } else {
          typeR = "次月";
        }
        this.form.settlementPeriod =
          typeL +
          this.settlementPeriodMonth.valueL +
          typeR +
          this.settlementPeriodMonth.valueR; //结算周期
      } else if (this.form.settlementPeriodType == "2") {
        this.form.settlementPeriod =
          this.settlementPeriodWeek.firstV +
          "-" +
          this.settlementPeriodWeek.secondV +
          " " +
          this.settlementPeriodWeek.thirdV +
          "-" +
          this.settlementPeriodWeek.fourthV;
      }
    },
    // 判断结算周期是月还是双周
    monthOrweek(val) {
      this.form.settlementPeriodType = val;
      if (this.form.settlementPeriodType == "3") {
        let typeL = "";
        let typeR = "";
        if (
          this.settlementPeriodMonth.typeL &&
          this.settlementPeriodMonth.typeL == "1"
        ) {
          typeL = "本月";
        } else {
          typeL = "上月";
        }
        if (
          this.settlementPeriodMonth.typeR &&
          this.settlementPeriodMonth.typeR == "1"
        ) {
          typeR = "本月";
        } else {
          typeR = "次月";
        }
        this.form.settlementPeriod =
          typeL +
          this.settlementPeriodMonth.valueL +
          typeR +
          this.settlementPeriodMonth.valueR; //结算周期
      } else if (this.form.settlementPeriodType == "2") {
        this.form.settlementPeriod =
          this.settlementPeriodWeek.firstV +
          "-" +
          this.settlementPeriodWeek.secondV +
          " " +
          this.settlementPeriodWeek.thirdV +
          "-" +
          this.settlementPeriodWeek.fourthV;
      }
    },
    handleAvatarError(val) {},
    beforeUpload(file) {
      console.log(file);
    },
    handleAvatarSuccess1(data) {
      if (data && data.errorCode == "0") {
        this.$message({
          message: "合同模板导入成功",
          type: "success",
          duration: 1000,
        });
        data.data.forEach((item) => {
          item.contractDate1 = item.contractDate.replace("-", "");
        });
        this.contractDetail.contractDetail = data.data;
        this.tableData22.theadList = [];
        this.tableData22.dataList = [];
        this.contractDetail.contractDetail.forEach((item, index) => {
          this.contractDetail.contractDetail[index].year =
            item.contractDate1.substring(0, 4);
          this.contractDetail.contractDetail[index].month =
            item.contractDate1.substring(4, 6);
          this.$set(
            item,
            "MYzd",
            item.year +
              "" +
              ((item.month + "").length > 1 ? item.month : "0" + item.month)
          );
        });
        this.yearTableData = this.groupingData(
          this.contractDetail.contractDetail,
          "year"
        );
        this.tableData22.theadList = [
          {
            label: "",
            prop: "date",
          },
        ];
        this.yearTableData.forEach((item, index) => {
          let objTable1 = {};
          this.$set(objTable1, "label", item.year + "");
          this.$set(objTable1, "prop", "");
          this.$set(objTable1, "children", []);
          this.tableData22.theadList.push(objTable1);
          item.list.forEach((item1) => {
            let objTable2 = {};
            this.$set(objTable2, "label", item1.month + "月");
            this.$set(objTable2, "prop", item1.MYzd);
            this.tableData22.theadList[index + 1].children.push(objTable2);
          });
        });
        this.$set(this.tableData22.dataList, 0, {});
        if (this.form.contractType == "3") {
          this.$set(this.tableData22.dataList, 1, {});
        }

        this.tableData22.dataList.forEach((item, index) => {
          this.contractDetail.contractDetail.forEach((item1) => {
            this.$set(this.tableData22.dataList[0], "date", "气量(万方)");
            this.$set(this.tableData22.dataList[0], "all", "");
            if (this.form.contractType == "3") {
              this.$set(this.tableData22.dataList[1], "date", "单价(元/方)");
              this.$set(this.tableData22.dataList[1], "isShow", "1");
              // this.$set(this.tableData22.dataList[1], "all", "");
            }
            this.$set(
              this.tableData22.dataList[0],
              item1.MYzd + "",
              item1.volume
            );
            if (this.form.contractType == "3") {
              this.$set(
                this.tableData22.dataList[1],
                item1.MYzd + "",
                item1.price
              );
            }
          });
        });
      } else {
        this.$message({
          message: data.errorMsg,
          type: "error",
          duration: 1000,
        });
      }
    },
    uploadHandle() {},
    // 上传成功后
    handleAvatarSuccess(data) {
      if (data.data) {
        let obj = {
          contractId: "",
          createDate: "",
          createUser: this.userInfo.userId,
          fileName: data.data.fileName,
          filePath: data.data.fileUrl,
          id: "",
          isDeleted: 0,
          modifiedDate: "",
          modifiedUser: 0,
        };
        this.contractFiles.push(obj);
        this.fileListLengt = this.fileList.length;
      }
    },
    // 导出excel模板
    exportExcel() {
      if (this.form.ContractTerm && this.form.ContractTerm.length > 1) {
        let data = {
          beginDate: this.form.ContractTerm[0]
            ? getCusYear1(this.form.ContractTerm[0])
            : "",
          endDate: this.form.ContractTerm[1]
            ? getCusYear1(this.form.ContractTerm[1])
            : "",
        };
        dongguanApi.contract.contractExportexcel(data).then((res) => {
          this.download(res, "xls", "export");
        });
      } else {
        this.$message({
          message: "请先选择合同期",
          type: "error",
          duration: 1000,
        });
      }
    },
    contractFindUnSubmitContract() {
      let data = {
        userId: this.userInfo.userId,
        agreement: false,
      };
      dongguanApi.contract.contractFindUnSubmitContract(data).then((res) => {
        if (res && res.length) {
          this.isEditConstrct = true;
          this.contractDetail = res[0];
        }
      });
    },
    consoleSave() {
      this.isEditConstrct = false;
      this.contractDeleteUnSubmitContract();
    },
    contractDeleteUnSubmitContract() {
      let data = {
        id: this.contractDetail.id,
      };
      dongguanApi.contract
        .contractDeleteUnSubmitContract(data)
        .then((res) => {});
    },
    searchUserName(inputValue) {
      this.options = [];
      let data = {
        code: this.curComCode,
        currentPage: 1,
        keyWord: inputValue,
        orgLevel: this.curComInfo.orgLevel,
        pageSize: 50,
      };
      dongguanApi.contract.basicInfoList(data).then((res) => {
        this.options = res[0].list;
      });
    },
    handleSelectChangeEvent(val) {
      this.options.forEach((item) => {
        if (item.bp == val) {
          this.form.userCode = item.bp;
          this.form.userName = item.name;
        }
      });
    },
    basicInfoList() {
      let data = {
        code: this.curComCode,
        currentPage: 1,
        keyWord: this.form.userName,
        orgLevel: this.curComInfo.orgLevel,
        pageSize: 50,
      };
      dongguanApi.contract.basicInfoList(data).then((res) => {
        this.options = res[0].list;
      });
    },
    delBtnConfirm() {
      this.isEditConstrct = false;
      this.form.userCode = this.contractDetail.bp;
      if (
        this.contractDetail.contractBeginDate &&
        this.contractDetail.contractEndDate
      ) {
        this.$set(this.form, "ContractTerm", [
          this.contractDetail.contractBeginDate,
          this.contractDetail.contractEndDate,
        ]);
      }
      this.expirationCycleshow = false;
      this.expirationCycleshow = true;
      this.expirationCycleshow1 = false;
      this.expirationCycleshow1 = true;
      this.temp1++;
      this.temp2++;
      this.getContractId = this.contractDetail.id;
      // 交割周期数据回显
      if (this.contractDetail.deliveryCycleBegin.indexOf("日") != -1) {
        this.expirationCycleO.deliveryCycleBegin =  this.contractDetail.deliveryCycleBegin;
      } else {
        this.expirationCycleO.deliveryCycleBegin = this.contractDetail.deliveryCycleBegin + "点";
      }
      if (this.contractDetail.deliveryCycleEnd.indexOf("日") != -1) {
        this.expirationCycleO.deliveryCycleEnd =  this.contractDetail.deliveryCycleEnd;
      } else {
        this.expirationCycleO.deliveryCycleEnd =  this.contractDetail.deliveryCycleEnd + "点";
      }
      this.expirationCycleO.deliveryCycleTypeL = "1";
      this.expirationCycleO.deliveryCycleTypeR =
        this.contractDetail.deliveryCycleEndDay.indexOf(",") != -1
          ? this.contractDetail.deliveryCycleEndDay.split(",")[1]
          : this.contractDetail.deliveryCycleEndDay;
      this.form.ContractName = this.contractDetail.contractName;
      this.form.ContractCode = this.contractDetail.contractNo;
      this.form.yearAllNum = this.contractDetail.contractTotalAmount;
      this.form.contractDetailAmount = this.contractDetail.contractDetailAmount;//每月明细汇总气量
      this.form.contractType = this.contractDetail.contractType;
      this.form.supplierAbbreviation = this.contractDetail.gasSource; //供应商简称（改）
      this.form.supplierName = this.contractDetail.contractGas; //供应商名称
      this.form.gasName = this.contractDetail.contractGasName; //气源来源（改）
      this.form.deviationSettlementRate = this.contractDetail.deviationRatio; //偏差结算率
      this.form.transmissionPrice = this.contractDetail.distributionPrice; //输配价格元/方
      this.form.receivePoint = this.contractDetail.receive; //接收点
      this.form.receivePressurePoint = this.contractDetail.receivePressure; //接收点压力
      this.form.receivePressureMax = this.contractDetail.receivePressureMax,//接收点压力最大值
      this.form.userName = this.contractDetail.customerName;
      this.form.dayChangeTime = this.contractDetail.dayChangeTime;
      this.form.dayMaxRate = this.contractDetail.dayExtractionRatioMax;
      this.form.dayMinRate = this.contractDetail.dayExtractionRatioMin;
      this.form.dayReplayTime = this.contractDetail.dayReplyTime;
      this.form.daySubmitTime = this.contractDetail.daySubmitTime;
      this.form.deliveryPoint = this.contractDetail.deliver;
      this.form.deliveryPointPressure = this.contractDetail.deliverPressure;
      this.form.deliverPressureMax = this.contractDetail.deliverPressureMax;//交付点压力最大值
      this.form.expirationCycleStartTime =  this.contractDetail.deliveryCycleBegin;
      this.form.expirationCycleEndTime = this.contractDetail.deliveryCycleEnd;
      this.form.DepartmenRate = this.contractDetail.diversityRatio; //供销差率
      this.form.cqDividingPoint = this.contractDetail.dividingPoint; //产权分界点
      this.form.isRevealAllDetail = this.contractDetail.isBottom + ""; //: "", //是否兜底气源
      this.form.meteringMode = this.contractDetail.measurementMode; //计量方式
      this.form.monthMaxRate = this.contractDetail.monthExtractionRatioMax; //月最大提取率
      this.form.monthMinRate = this.contractDetail.monthExtractionRatioMin; //月最小提取率
      this.form.monthReplayTime = this.contractDetail.monthReplyTime; //月指定批复时间
      this.form.monthSubmitTime = this.contractDetail.monthSubmitTime; //月指定提交时间
      this.form.overdraftRatio = this.contractDetail.overLiftRangeRatio; //超提范围比率
      this.form.remark = this.contractDetail.remark; //备注
      this.form.settlementDay = this.contractDetail.settlementDate.split(","); //settlementDay结算日
      this.form.settlementStyle = this.contractDetail.settlementMode; //结算方式
      this.form.settlementStyle = this.contractDetail.settlementMode; //结算方式
      if (this.contractDetail.settlementPeriod) {
        let asd = this.contractDetail.settlementPeriod.split(",");
        let splitArr = [];
        asd.forEach((item) => {
          let obj = [];
          splitArr = [...splitArr, ...item.split("-")];
        });
        this.settlementPeriod1 = splitArr;
      }
      console.log(this.settlementPeriod1)
      this.form.settlementPeriodType = this.contractDetail.settlementPeriodType;
      this.form.ContractSignDate = this.contractDetail.signingDate; //签订日期
      this.form.outstandingClear = this.contractDetail.uncdrLiftClear; //欠提清零天数/月
      this.form.outstandingClearC = this.contractDetail.uncdrLiftClearType; //欠提清零天数/月类型,
      this.form.outstandingRatio = this.contractDetail.uncdrLiftRangeRatio; //欠提范围比率
      this.form.receivePriceSummer = this.contractDetail.receivePriceSummer; //接收点夏季价格
      this.form.receivePriceWinter = this.contractDetail.receivePriceWinter; //接收点冬季价格
      this.form.deliverPriceSummer = this.contractDetail.deliverPriceSummer; //交付点夏季价格
      this.form.deliverPriceWinter = this.contractDetail.deliverPriceWinter; //交付点冬季价格
      this.tableData22.theadList = [];
      this.tableData22.dataList = [];
      if(this.contractDetail.contractDetail &&this.contractDetail.contractDetail.length>0){
        this.contractDetail.contractDetail.forEach((item, index) => {
          this.contractDetail.contractDetail[index].year =
            item.contractDate1.substring(0, 4);
          this.contractDetail.contractDetail[index].month =
            item.contractDate1.substring(4, 6);

          this.$set(
            item,
            "MYzd",
            item.year +
              "" +
              ((item.month + "").length > 1 ? item.month : "0" + item.month)
          );
        });
        this.yearTableData = this.groupingData(
          this.contractDetail.contractDetail,
          "year"
        );
        this.tableData22.theadList = [
          {
            label: "",
            prop: "date",
          },
        ];
        this.yearTableData.forEach((item, index) => {
          let objTable1 = {};
          this.$set(objTable1, "label", item.year + "");
          this.$set(objTable1, "prop", "");
          this.$set(objTable1, "children", []);
          this.tableData22.theadList.push(objTable1);
          item.list.forEach((item1) => {
            let objTable2 = {};
            this.$set(objTable2, "label", item1.month + "月");
            this.$set(objTable2, "prop", item1.MYzd);
            this.tableData22.theadList[index + 1].children.push(objTable2);
          });
        });
        this.$set(this.tableData22.dataList, 0, {});
        if (this.form.contractType == "3") {
          this.$set(this.tableData22.dataList, 1, {});
        }
        this.tableData22.dataList.forEach((item, index) => {
          this.contractDetail.contractDetail.forEach((item1) => {
            this.$set(this.tableData22.dataList[0], "date", "气量(万方)");
            this.$set(this.tableData22.dataList[0], "all", "");
            if (this.form.contractType == "3") {
              this.$set(this.tableData22.dataList[1], "date", "单价(元/方)");
              this.$set(this.tableData22.dataList[1], "isShow", "1");
              // this.$set(this.tableData22.dataList[1], "all", "");
            }
            this.$set(
              this.tableData22.dataList[0],
              item1.MYzd + "",
              item1.volume
            );
            if (this.form.contractType == "3") {
              this.$set(
                this.tableData22.dataList[1],
                item1.MYzd + "",
                item1.price
              );
            }
          });
        });
        this.tableData22.dataList[0].all = this.form.contractDetailAmount //每月明细汇总气量
        this.jisuanAll();
      }
      let fileLista = [];
      if ( this.contractDetail.contractFiles && this.contractDetail.contractFiles.length > 0) {
        this.contractDetail.contractFiles.forEach((item) => {
          let obj = {};
          obj.contractId = item.contractId;
          obj.contractId = item.contractId;
          obj.createDate = item.createDate;
          obj.createUser = item.createUser;
          obj.fileName = item.fileName;
          obj.filePath = item.filePath;
          obj.id = item.id;
          obj.isDeleted = item.isDeleted;
          obj.modifiedDate = item.modifiedDate;
          obj.modifiedUser = item.modifiedUser;
          fileLista.push(obj);
        });
      }
      fileLista.forEach((item) => {
        item.name = item.fileName;
        item.url = item.filePath;
      });
      this.fileList = fileLista;
    },
    // excel模板导入
    contractImportExcel(data) {
      dongguanApi.contract.contractImportExcel(data).then((res) => {});
    },
    changeRadio(val) {
      if (this.isEdit) {
        this.tableData22.theadList = [];
        this.tableData22.dataList = [];
        this.contractDetail.contractDetail.forEach((item, index) => {
          this.contractDetail.contractDetail[index].year =
            item.contractDate1.substring(0, 4);
          this.contractDetail.contractDetail[index].month =
            item.contractDate1.substring(4, 6);
          this.$set(item, "MYzd", item.year + "" + ((item.month + "").length > 1 ? item.month : "0" + item.month));
        });
        this.yearTableData = this.groupingData( this.contractDetail.contractDetail, "year");
        this.tableData22.theadList = [
          {
            label: "",
            prop: "date",
          },
        ];
        this.yearTableData.forEach((item, index) => {
          let objTable1 = {};
          this.$set(objTable1, "label", item.year + "");
          this.$set(objTable1, "prop", "");
          this.$set(objTable1, "children", []);
          this.tableData22.theadList.push(objTable1);
          item.list.forEach((item1) => {
            let objTable2 = {};
            this.$set(objTable2, "label", item1.month + "月");
            this.$set(objTable2, "prop", item1.MYzd);
            this.tableData22.theadList[index + 1].children.push(objTable2);
          });
        });
        this.$set(this.tableData22.dataList, 0, {});
        if (this.form.contractType == "3") {
          this.$set(this.tableData22.dataList, 1, {});
        }
        this.tableData22.dataList.forEach((item, index) => {
          this.contractDetail.contractDetail.forEach((item1) => {
            this.$set(this.tableData22.dataList[0], "date", "气量(万方)");
            this.$set(this.tableData22.dataList[0], "all", "");
            if (this.form.contractType == "3") {
              this.$set(this.tableData22.dataList[1], "date", "单价(元/方)");
              this.$set(this.tableData22.dataList[1], "isShow", "1");
              // this.$set(this.tableData22.dataList[1], "all", "");
            }
            this.$set(
              this.tableData22.dataList[0],
              item1.MYzd + "",
              item1.volume
            );
            if (this.form.contractType == "3") {
              this.$set(
                this.tableData22.dataList[1],
                item1.MYzd + "",
                item1.price
              );
            }
          });
        });
        // this.form.contractDetailAmount = this.form.yearAllNum
        this.tableData22.dataList[0].all = this.form.contractDetailAmount
        this.jisuanAll();
      } else {
        if (this.form.ContractTerm && this.form.ContractTerm.length > 0) {
          this.ContractTermDate(this.form.ContractTerm);
        }
      }
    },
    // 获取合同详情
    contractGet() {
      let data = {
        id: this.getContractId,
      };
      dongguanApi.contract.contractGet(data).then((res) => {
        if (res.length) {
          this.expirationCycleshow = false;
          this.expirationCycleshow = true;
          this.expirationCycleshow1 = false;
          this.expirationCycleshow1 = true;
          this.temp1++;
          this.temp2++;
          this.contractDetail = res[0];
          this.form.userCode = this.contractDetail.bp;
          this.$set(this.form, "ContractTerm", [
            this.contractDetail.contractBeginDate,
            this.contractDetail.contractEndDate,
          ]);
          // 交割周期数据回显
          if (this.contractDetail.deliveryCycleBegin) {
            if (this.contractDetail.deliveryCycleBegin.indexOf("日") != -1) {
              this.expirationCycleO.deliveryCycleBegin =
                this.contractDetail.deliveryCycleBegin;
            } else {
              this.expirationCycleO.deliveryCycleBegin =
                this.contractDetail.deliveryCycleBegin + "点";
            }
          }
          if (this.contractDetail.deliveryCycleEnd) {
            if (this.contractDetail.deliveryCycleEnd.indexOf("日") != -1) {
              this.expirationCycleO.deliveryCycleEnd =
                this.contractDetail.deliveryCycleEnd;
            } else {
              this.expirationCycleO.deliveryCycleEnd =
                this.contractDetail.deliveryCycleEnd + "点";
            }
          }
          this.expirationCycleO.deliveryCycleTypeL = "1";
          this.expirationCycleO.deliveryCycleTypeR =  this.contractDetail.deliveryCycleEndDay.indexOf(",") != -1 ? this.contractDetail.deliveryCycleEndDay.split(",")[1]: this.contractDetail.deliveryCycleEndDay;
          this.form.ContractName = this.contractDetail.contractName;
          this.form.ContractCode = this.contractDetail.contractNo;
          this.form.yearAllNum = this.contractDetail.contractTotalAmount;
          this.form.contractDetailAmount = this.contractDetail.contractDetailAmount?this.contractDetail.contractDetailAmount:0;
          this.form.contractType = this.contractDetail.contractType;
          this.form.supplierAbbreviation = this.contractDetail.gasSource //供应商简称（换）
          this.form.supplierName = this.contractDetail.contractGas//供应商名称
          this.form.gasName = this.contractDetail.contractGasName//气源来源  （换）
          this.form.deviationSettlementRate = this.contractDetail.deviationRatio//偏差结算率
          this.form.transmissionPrice = this.contractDetail.distributionPrice//输配价格元/方
          this.form.receivePoint = this.contractDetail.receive//接收点
          this.form.receivePressurePoint= this.contractDetail.receivePressure?this.contractDetail.receivePressure:undefined//接收点压力
          this.form.receivePressureMax = this.contractDetail.receivePressureMax?this.contractDetail.receivePressureMax:undefined,//接收点压力最大值
          this.form.userName = this.contractDetail.customerName;
          this.form.dayChangeTime = this.contractDetail.dayChangeTime;
          this.form.dayMaxRate = this.contractDetail.dayExtractionRatioMax;
          this.form.dayMinRate = this.contractDetail.dayExtractionRatioMin;
          this.form.dayReplayTime = this.contractDetail.dayReplyTime;
          this.form.daySubmitTime = this.contractDetail.daySubmitTime;
          this.form.deliveryPoint = this.contractDetail.deliver;
          this.form.deliveryPointPressure = this.contractDetail.deliverPressure?this.contractDetail.deliverPressure:undefined;//交付点压力最小值
          this.form.deliverPressureMax = this.contractDetail.deliverPressureMax?this.contractDetail.deliverPressureMax:undefined;//交付点压力最大值
          this.form.expirationCycleStartTime =
          this.contractDetail.deliveryCycleBegin;
          this.form.expirationCycleEndTime =
          this.contractDetail.deliveryCycleEnd;
          this.form.DepartmenRate = this.contractDetail.diversityRatio; //供销差率
          this.form.cqDividingPoint = this.contractDetail.dividingPoint; //产权分界点
          this.form.isRevealAllDetail = this.contractDetail.isBottom + ""; //: "", //是否兜底气源
          this.form.meteringMode = this.contractDetail.measurementMode; //计量方式
          this.form.monthMaxRate = this.contractDetail.monthExtractionRatioMax; //月最大提取率
          this.form.monthMinRate = this.contractDetail.monthExtractionRatioMin; //月最小提取率
          this.form.monthReplayTime = this.contractDetail.monthReplyTime; //月指定批复时间
          this.form.monthSubmitTime = this.contractDetail.monthSubmitTime; //月指定提交时间
          this.form.overdraftRatio = this.contractDetail.overLiftRangeRatio; //超提范围比率
          this.form.remark = this.contractDetail.remark; //备注
          this.form.settlementDay = this.contractDetail.settlementDate.split(","); //settlementDay结算日
          this.form.settlementStyle = this.contractDetail.settlementMode; //结算方式
          if (this.contractDetail.settlementPeriod) {
            let asd = this.contractDetail.settlementPeriod.split(",");
            let splitArr = [];
            asd.forEach((item) => {
              let obj = [];
              splitArr = [...splitArr, ...item.split("-")];
            });
            this.settlementPeriod1 = splitArr;
          }
          this.form.settlementPeriodType =
            this.contractDetail.settlementPeriodType;
          this.form.ContractSignDate = this.contractDetail.signingDate; //签订日期
          this.form.outstandingClear = this.contractDetail.uncdrLiftClear; //欠提清零天数/月
          this.form.outstandingClearC = this.contractDetail.uncdrLiftClearType; //欠提清零天数/月类型,
          this.form.outstandingRatio = this.contractDetail.uncdrLiftRangeRatio; //欠提范围比率
          this.form.receivePriceSummer = this.contractDetail.receivePriceSummer; //接收点夏季价格
          this.form.receivePriceWinter = this.contractDetail.receivePriceWinter; //接收点冬季价格
          this.form.deliverPriceSummer = this.contractDetail.deliverPriceSummer; //交付点夏季价格
          this.form.deliverPriceWinter = this.contractDetail.deliverPriceWinter; //交付点冬季价格
          this.tableData22.theadList = [];
          this.tableData22.dataList = [];
          this.contractDetail.contractDetail.forEach((item, index) => {
            this.contractDetail.contractDetail[index].year =
              item.contractDate1.substring(0, 4);
            this.contractDetail.contractDetail[index].month =
              item.contractDate1.substring(4, 6);
            this.$set(
              item,
              "MYzd",
              item.year +
                "" +
                ((item.month + "").length > 1 ? item.month : "0" + item.month)
            );
          });
          this.yearTableData = this.groupingData(
            this.contractDetail.contractDetail,
            "year"
          );
          this.tableData22.theadList = [
            {
              label: "",
              prop: "date",
            },
          ];
          this.yearTableData.forEach((item, index) => {
            let objTable1 = {};
            this.$set(objTable1, "label", item.year + "");
            this.$set(objTable1, "prop", "");
            this.$set(objTable1, "children", []);
            this.tableData22.theadList.push(objTable1);
            item.list.forEach((item1) => {
              let objTable2 = {};
              this.$set(objTable2, "label", item1.month + "月");
              this.$set(objTable2, "prop", item1.MYzd);
              this.tableData22.theadList[index + 1].children.push(objTable2);
            });
          });
          this.$set(this.tableData22.dataList, 0, {});
          if (this.form.contractType == "3") {
            this.$set(this.tableData22.dataList, 1, {});
          }
          this.tableData22.dataList.forEach((item, index) => {
            this.contractDetail.contractDetail.forEach((item1) => {
              this.$set(this.tableData22.dataList[0], "date", "气量(万方)");
              this.$set(this.tableData22.dataList[0], "all", "");
              if (this.form.contractType == "3") {
                this.$set(this.tableData22.dataList[1], "date", "单价(元/方)");
                this.$set(this.tableData22.dataList[1], "isShow", "1");
                // this.$set(this.tableData22.dataList[1], "all", "");
              }
              this.$set( this.tableData22.dataList[0],item1.MYzd + "", item1.volume
              );
              if (this.form.contractType == "3") {
                this.$set(
                  this.tableData22.dataList[1],
                  item1.MYzd + "",
                  item1.price
                );
              }
            });
          });
          this.tableData22.dataList[0].all = this.form.contractDetailAmount
          this.jisuanAll();
          let fileLista = [];
          if (this.contractDetail.contractFiles.length > 0) {
            this.contractDetail.contractFiles.forEach((item) => {
              let obj = {};
              obj.contractId = item.contractId;
              obj.contractId = item.contractId;
              obj.createDate = item.createDate;
              obj.createUser = item.createUser;
              obj.fileName = item.fileName;
              obj.filePath = item.filePath;
              obj.id = item.id;
              obj.isDeleted = item.isDeleted;
              obj.modifiedDate = item.modifiedDate;
              obj.modifiedUser = item.modifiedUser;
              fileLista.push(obj);
            });
          }
          fileLista.forEach((item) => {
            item.name = item.fileName;
            item.url = item.filePath;
          });
          this.fileList = fileLista;
          this.fileListLengt = this.fileList.length;
        }
      });
    },
    // 添加编辑合同报文
    addEditData(type) {
      let data = {
        bp: this.form.userCode,
        changeMonth: "",
        compCode: this.curComInfo.orgCode,
        contractBeginDate: this.form.ContractTerm[0]? getCusYear1(this.form.ContractTerm[0]): "",
        contractDetail: [],
        contractEndDate: this.form.ContractTerm[1]
          ? getCusYear1(this.form.ContractTerm[1])
          : "",
        contractFiles: [],
        contractGasName:this.form.gasName ,//气源来源
        contractGas:this.form.supplierName,//供应商名称
        gasSource:this.form.supplierAbbreviation,//供应商简称
        deviationRatio:this.form.deviationSettlementRate,//偏差结算率
        distributionPrice:this.form.transmissionPrice,//输配价格元/方
        receive:this.form.receivePoint,//接收点
        receivePressure:this.form.receivePressurePoint?this.form.receivePressurePoint:'',//接收点压力最小值
        receivePressureMax:this.form.receivePressureMax?this.form.receivePressureMax:'',//接收点压力最大值
        contractId: "",
        contractName: this.form.ContractName,
        contractNo: this.form.ContractCode,
        contractTotalAmount: this.form.contractDetailAmount,
        contractDetailAmount:this.form.contractDetailAmount,
        contractType: this.form.contractType,
        cpmoCop: this.curComInfo.orgCode,
        orgLevel: this.curComInfo.orgLevel,
        createUser: this.userInfo.userId,
        customerName: this.form.userName,
        dayChangeTime: this.form.dayChangeTime,
        dayExtractionRatioMax: this.form.dayMaxRate,
        dayExtractionRatioMin: this.form.dayMinRate,
        dayReplyTime: this.form.dayReplayTime + "",
        daySubmitTime: this.form.daySubmitTime + "",
        deliver: this.form.deliveryPoint,
        deliverPressure: this.form.deliveryPointPressure?this.form.deliveryPointPressure:'',////交付点压力最小值
        deliverPressureMax: this.form.deliverPressureMax?this.form.deliverPressureMax:'',//交付点压力最大值
        deliveryCycleBegin: this.deliveryCycle.valueL.slice(0,this.deliveryCycle.valueL.length-1),
        deliveryCycleEnd: this.deliveryCycle.valueR.slice(0,this.deliveryCycle.valueR.length-1),
        deliveryCycleEndDay: this.deliveryCycle.typeR, //交割周期截止日1：本日；2：次日；
        diversityRatio: this.form.DepartmenRate, //供销差率
        dividingPoint: this.form.cqDividingPoint, //产权分界点
        id: this.getContractId,
        isBottom: parseInt(this.form.isRevealAllDetail), //: "", //是否兜底气源
        isSubmit: type, //提交1，保存2
        measurementMode: this.form.meteringMode, //计量方式
        monthExtractionRatioMax: this.form.monthMaxRate, //月最大提取率
        monthExtractionRatioMin: this.form.monthMinRate, //月最小提取率
        monthReplyTime: this.form.monthReplayTime, //月指定批复时间
        monthSubmitTime: this.form.monthSubmitTime, //月指定提交时间
        overLiftRangeRatio: this.form.overdraftRatio, //超提范围比率
        receivePriceSummer: this.form.receivePriceSummer, //接收点夏季价格
        receivePriceWinter: this.form.receivePriceWinter, //接收点冬季价格
        deliverPriceSummer: this.form.deliverPriceSummer, //交付点夏季价格
        deliverPriceWinter: this.form.deliverPriceWinter, //交付点冬季价格
        remark: this.form.remark, //备注
        settlementDate:
          this.form.settlementDay.length > 0
            ? this.form.settlementDay.join(",")
            : "", //settlementDay结算日
        settlementMode: this.form.settlementStyle, //结算方式
        settlementPeriodType: this.form.settlementPeriodType, //结算周期类型
        signingDate: this.form.ContractSignDate
          ? getCusYear1(this.form.ContractSignDate)
          : "", //签订日期
        uncdrLiftClear: this.form.outstandingClear, //欠提清零天数/月
        uncdrLiftClearType: this.form.outstandingClearC, //欠提清零天数/月类型,
        uncdrLiftRangeRatio: this.form.outstandingRatio, //欠提范围比率
      };
      // 结算周期
      if (this.form.settlementPeriodType == "3") {
        let typeL = "";
        let typeR = "";
        if (
          this.settlementPeriodMonth.typeL &&
          this.settlementPeriodMonth.typeL == "1"
        ) {
          typeL = "本月";
        } else {
          typeL = "上月";
        }
        if (
          this.settlementPeriodMonth.typeR &&
          this.settlementPeriodMonth.typeR == "1"
        ) {
          typeR = "本月";
        } else {
          typeR = "次月";
        }
        data.settlementPeriod =
          typeL +
          "-" +
          this.settlementPeriodMonth.valueL +
          "," +
          typeR +
          "-" +
          this.settlementPeriodMonth.valueR; //结算周期
        data.settlementPeriodTypeL = this.settlementPeriodMonth.typeL;
        data.settlementPeriodTypeR = this.settlementPeriodMonth.typeR;
      } else if (this.form.settlementPeriodType == "2") {
        data.settlementPeriod =
          this.settlementPeriodWeek.firstV +
          "-" +
          this.settlementPeriodWeek.secondV +
          "," +
          this.settlementPeriodWeek.thirdV +
          "-" +
          this.settlementPeriodWeek.fourthV;

        data.firstV = this.settlementPeriodWeek.firstV;
        data.secondV = this.settlementPeriodWeek.secondV;
        data.thirdV = this.settlementPeriodWeek.thirdV;
        data.fourthV = this.settlementPeriodWeek.fourthV;
      }
      for (let key in this.tableData22.dataList[0]) {
        let obj1 = {
          contractId: "",
          id: 0,
          isSupplement: 0,
        };
        if (key != "date" && key != "all") {
          obj1.contractDate = key;
          obj1.volume = this.tableData22.dataList[0][key];
          data.contractDetail.push(obj1);
        }
      }
      for (let key in this.tableData22.dataList[1]) {
        data.contractDetail.forEach((item) => {
          if (key == item.contractDate) {
            item.price = this.tableData22.dataList[1][key];
          }
        });
      }
      this.fileList.forEach((item) => {
        let obj = {};
        if (item.response && item.response.code == "200") {
          obj.contractId = "";
          obj.createDate = "";
          obj.createUser = "";
          obj.fileName = item.response.data.fileName;
          obj.filePath = item.response.data.fileUrl;
          obj.id = "";
          obj.isDeleted = item.isDeleted;
          obj.modifiedDate = "";
          obj.modifiedUser = "";
        } else {
          obj.contractId = item.contractId ? item.contractId : "";
          obj.createDate = item.createDate ? item.createDate : "";
          obj.createUser = item.createUser ? item.createUser : "";
          obj.fileName = item.fileName ? item.fileName : "";
          obj.filePath = item.filePath ? item.filePath : "";
          obj.id = item.id ? item.id : "";
          obj.isDeleted = item.isDeleted ? item.isDeleted : "";
          obj.modifiedDate = item.modifiedDate ? item.modifiedDate : "";
          obj.modifiedUser = item.modifiedUser ? item.modifiedUser : "";
        }
        data.contractFiles.push(obj);
      });
      return data;
    },
    submitSuccessBtn() {
      this.submitSuccess = false;
      this.backGo();
      this.$emit("isbackGo", true);
    },
    // 添加合同
    addConstruct(rule, type) {
      let data = this.addEditData(type);
      dongguanApi.contract.contractSave(data).then((res) => {
        if (res) {
          if (this.isSubmitB) {
            this.submitSuccess = true;
            this.submitSuccessName = res[0].customerName;
            this.$message({
              message: "合同提交成功",
              type: "success",
              duration: 1000,
            });
          } else {
            this.$message({
              message: "合同暂存成功",
              type: "success",
              duration: 1000,
            });
            this.backGo();
          }
        }
      });
    },
    // 修改合同
    contractUpdate(rule, type) {
      let data = this.addEditData(type);
      dongguanApi.contract.contractUpdate(data).then((res) => {
        if (res) {
          this.submitSuccessName = res[0].customerName;
          if (this.isSubmitB) {
            this.submitSuccess = true;
            this.$message({
              message: "修改合同提交成功",
              type: "success",
              duration: 1000,
            });
          } else {
            this.$message({
              message: "修改合同暂存成功",
              type: "success",
              duration: 1000,
            });
            this.backGo();
          }
        } else {
        }
      });
    },
    submitBtn(formName, type) {
      this.isSubmitB = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.contractUpdate("", type);
          } else {
            this.addConstruct("", type);
          }
        } else {
          this.$message({
            message: "请填写正确的必填信息",
            type: "error",
            duration: 1000,
          });
        }
      });
    },
    saveBtn(rule, type) {
      this.isSubmitB = false;
      if (this.isEdit) {
        this.contractUpdate("", type);
      } else {
        this.addConstruct("", type);
      }
    },
    getFloat(num, n) {
      n = n ? parseInt(n) : 0;
      if (n <= 0) {
        return Math.round(num);
      }
      num = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); //四舍五入
      num = Number(num).toFixed(n); //补足位数
      return num;
    },
    // 修改表格计算总量
    jisuanAll() {
      this.flagAll = false
      this.tableData22.dataList.forEach((item) => {
        let asd = 0;
        if (item.date == "单价(元/方)") {
          return;
        } else {
          for (let i in item) {
            if (i != "all" && i != "date") {
              asd += Number(item[i]);
              this.getFloat(asd, "4");
              let all = asd.toFixed(4).replace(/[.]?0+$/, "")
                ? asd.toFixed(4).replace(/[.]?0+$/, "")
                : 0
                if(all>0){
                  this.flagAll = true
                }else{
                  this.flagAll = false
                }
            }
          }
        }
        // this.form.yearAllNum = this.tableData22.dataList[0].all;
      });
    },
    handleChangeNumber() {
      this.form.contractDetailAmount = this.tableData22.dataList[0].all
      this.jisuanAll();
    },
    allChangeN(){
      this.form.contractDetailAmount = this.tableData22.dataList[0].all
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-5);
    },
    onremove(val) {
      let index11 = 0;
      this.fileList.forEach((item, index) => {
        if (item.id == val.id || !val.id) {
          this.fileList[index].isDeleted = 1;
        }
        if (this.fileList[index].isDeleted != 1) {
          index11++;
        }
        this.fileListLengt = index11;
      });
    },
    backGo() {
      this.$emit("backGo");
    },
    getYearAndMonth(start, end) {
      let result = [];
      let starts = start.split("-");
      let ends = end.split("-");
      let staYear = parseInt(starts[0]);
      let staMon = parseInt(starts[1]);
      let endYear = parseInt(ends[0]);
      let endMon = parseInt(ends[1]);
      result.push({ year: staYear, month: staMon });
      while (staYear <= endYear) {
        if (staYear === endYear) {
          while (staMon < endMon) {
            staMon++;
            result.push({ year: staYear, month: staMon });
          }
          staYear++;
        } else {
          staMon++;
          if (staMon > 12) {
            staMon = 1;
            staYear++;
          }
          result.push({ year: staYear, month: staMon });
        }
      }
      return result;
    },
    ContractTermDate(val) {
      // 合同期没有值清空年合同总量
      if (!val) {
        this.form.yearAllNum = "";
      }
      this.tableTemp++;
      this.tableData22.dataList = [];
      this.tableData22.theadList = [];
      this.tableData22.theadList = [
        {
          label: "",
          prop: "date",
        },
      ];
      let data1 = getCusYear1(val[0]).substring(0, 7);
      let data2 = getCusYear1(val[1]).substring(0, 7);
      this.changeTableData = this.getYearAndMonth(data1, data2);
      this.changeTableData.forEach((item, index) => {
        this.$set(item, "yue", item.month);
        this.$set(
          item,
          "MYzd",
          item.year +
            "" +
            ((item.month + "").length > 1 ? item.month : "0" + item.month)
        );
        this.$set(item, "gas", 0);
        this.$set(item, "price", 0);
      });
      this.getYearAndMonth(data1, data2);
      //  根据年份进行分类
      this.yearTableData = this.groupingData(this.changeTableData, "year");
      this.yearTableData.forEach((item, index) => {
        let objTable1 = {};
        this.$set(objTable1, "label", item.year + "");
        this.$set(objTable1, "prop", "");
        this.$set(objTable1, "children", []);
        this.tableData22.theadList.push(objTable1);
        item.list.forEach((item1) => {
          let objTable2 = {};
          this.$set(objTable2, "label", item1.yue + "月");
          this.$set(objTable2, "prop", item1.MYzd);
          this.tableData22.theadList[index + 1].children.push(objTable2);
        });
      });
      this.$set(this.tableData22.dataList, 0, {});
      if (this.form.contractType == "3") {
        this.$set(this.tableData22.dataList, 1, {});
      }
      this.tableData22.dataList.forEach((item, index) => {
        this.changeTableData.forEach((item1) => {
          this.$set(this.tableData22.dataList[0], "date", "气量(万方)");
          this.$set(this.tableData22.dataList[0], "all", "");
          if (this.form.contractType == "3") {
            this.$set(this.tableData22.dataList[1], "date", "单价(元/方)");
            this.$set(this.tableData22.dataList[1], "isShow", "1");
            // this.$set(this.tableData22.dataList[1], "all", "");
          }
          this.$set(this.tableData22.dataList[0], item1.MYzd + "", item1.gas);
          if (this.form.contractType == "3") {
            this.$set(
              this.tableData22.dataList[1],
              item1.MYzd + "",
              item1.price
            );
          }
        });
      });
      this.form.contractDetailAmount = this.form.contractDetailAmount 
      this.form.contractDetailAmount = 0
      this.jisuanAll();
    },
    // / 传入两个参数 一个是待分组的数据 一个是按照哪个字段进行分组
    groupingData(data, filed) {
      // map用来保存存过的字段 为下边添加新对象或者将相同字段的数据保存到同一个list中
      let map = {};
      let dest = [];
      data.forEach((item) => {
        // 判断map对象中是否有遍历时data的key 如果没有则向dest数组中推入一个新的对象
        if (!map[item[filed]]) {
          dest.push({
            [filed]: item[filed],
            list: [item],
          });
          // 进行一次新添对象的记录
          map[item[filed]] = item;
          // 如果在map中有data遍历的key(字段相同) 则向dest数组里面的相同字段的list下推入数据
        } else {
          dest.forEach((dItem) => {
            if (dItem[filed] == item[filed]) {
              dItem.list.push(item);
            }
          });
        }
      });
      return dest;
    },
  },
};
</script>
<style lang='scss' scoped>
.add-agreement {
  background: #ffffff;
  margin: 20px;
  border-radius: 4px;
  margin-bottom: 55px;
  margin-top: 0;
  .custom-table{
    .table-form-cun{
      margin-bottom:1px!important;
    }
  }
  .set-detail {
    padding: 0 20px;
    margin-top: 10px;
    padding-top: 10px;
    /deep/.el-form-item__content {
      .is-disabled {
        .el-input__inner {
          background: #e4e7ed;
        }
      }
    }
    /deep/.el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #0fb3ad;
      border-color: #0fb3ad;
    }
    .custom-table-r {
      /deep/.el-table__body-wrapper {
        overflow-y: auto;
        height: 260px;
      }
    }
    .tip {
      background: #fdf2e9;
      border-radius: 8px;
      color: #ed7b1a;
      padding: 8px 24px;
    }
    .all-name {
      line-height: 50px;
      font-size: 16px;
      margin-left: 2px;
      font-weight: 600;
    }
    .search {
      display: flex;
      font-size: 16px;
      .clear-input {
        line-height: 37px;
        margin-left: 10px;
        color: #3480ff;
      }
      .el-icon-search {
        position: absolute;
        top: 35%;
        right: 17px;
      }
    }
    /deep/.el-dialog {
      .el-dialog__title {
        color: #303133;
      }
    }
    .set-detail-btn {
      text-align: right;
      padding: 25px;
      font-size: 16px;
      .consoleBtn {
        border: 1px solid #dcdfe6;
        color: #303133;
        background: #f5f7fa;
      }
      .disabledconsoleBtn {
        border: 1px solid #0fb2ab33;
        color: #0fb2ab52;
        margin-right: 22px;
      }
      .createBtn {
        background: #47a87d;
        color: #fff;
        border: none;
      }
      .disabledBtn {
        background: #0fb2ab42;
        border: none;
        color: #fff;
      }
    }
  }
  /deep/ .el-table__body {
    .el-input__inner {
      text-align: center;
    }
    tr td {
      text-align: center;
    }
  }
  /deep/.el-table thead.is-group th {
    text-align: center;
    background: #ebeef5;
  }
  /deep/.el-select .el-input__inner {
    border: 1px solid #dcdfe6 !important;
  }
  /deep/.el-input .el-input__inner {
    color: #303133;
    line-height: 32px;
  }
  /deep/.el-form-item__label {
    color: #303133;
  }
  .custom-table-n {
    /deep/ th:nth-last-child(2) {
      border-right: 1px solid #dcdfe6;
    }
  }
  .bottom-btn {
    .el-button {
      vertical-align: super;
    }
  }
  .submitBtn {
    position: fixed;
    bottom: 0;
    left: 220px;
    right: 0;
    text-align: right;
    background: #fff;
    height: 54px;
    line-height: 65px;
    box-shadow: 5px -3px 7px #bacce1;
    padding-right: 28px;
    box-sizing: border-box;
    z-index: 10;
    .submit {
      background: #47a87d;
      border: none;
    }
  }
  .add-agreement-top {
    height: 66px;
    line-height: 66px;
    padding: 0 20px;
    border-bottom: 1px solid #e4e7ed;
    .goback {
      margin-right: 10px;
      font-size: 18px;
      color: #409eff;
      cursor: pointer;
      font-weight: 700;
      vertical-align: top;
      .el-icon-back {
        font-weight: 700;
      }
    }
    .add-agreement-top-title {
      font-weight: 600;
      padding-left: 10px;
      border-left: 1px solid #dcdfe6;
      font-size: 18px;
      color: #303133;
    }
  }
  .form-content {
    padding: 0 20px;
    padding-bottom: 20px;
  }
  .outstandingClearC .el-input {
    width: 100%;
  }
  /deep/.el-radio.is-bordered.is-checked {
    border-color: #47a87d;
    background: rgba(71, 168, 125, 0.1);
  }
  /deep/.el-radio__input.is-checked + .el-radio__label {
    color: #47a87d;
  }
  /deep/.el-radio__input.is-checked .el-radio__inner {
    border-color: #47a87d;
    background: #47a87d;
  }
  /deep/.el-radio.is-bordered {
    background: #fff;
    border: none;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  .el-range-editor.el-input__inner {
    width: 100%;
  }
  /deep/ .el-table th.is-leaf {
    background: #ebeef5;
  }
  .add-block {
    background: #f5f7fa;
    padding: 20px;
    margin-top: 24px;
    padding-bottom: 10px;
    /deep/.el-select__tags {
      flex-wrap: nowrap;
      overflow: hidden;
    }
    /deep/.el-input-number {
      width: 100%;
      text-align: left;
      .el-input-number__increase {
        display: none;
      }
      .el-input-number__decrease {
        display: none;
      }
      .el-input__inner {
        text-align: left;
      }
    }
    .table-message {
      /deep/.el-table__header {
        width: 100% !important;
        th {
          text-align: center;
        }
      }
      /deep/ .el-table__empty-block {
        width: 100% !important;
      }
      .table-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .table {
        margin-bottom: 20px;
        /deep/.el-input {
          height: 36px;
        }
        /deep/.el-input-number {
          width: 100%;
          text-align: left;
          vertical-align: bottom;
          .el-input__inner {
            border-radius: 20px;
          }
          .el-input-number__increase {
            display: block;
            border-radius: 0 20px 0 0;
            width: 31px;
          }
          .el-input-number__decrease {
            display: block;
            border-radius: 0 0 20px 0;
            width: 31px;
          }
          .el-input__inner {
            text-align: center;
          }
        }
      }
      .table-price {
        width: 30%;
      }
      .uploadDown {
        display: flex;
        .button {
          border: 1px solid #47a87d;
          box-sizing: border-box;
          border-radius: 32px;
          line-height: 32px;
          height: 32px;
          width: 163px;
          font-size: 14px;
          text-align: center;
          box-sizing: border-box;
          margin-right: 10px;
          color: #47a87d;
          background: #fff;
        }
      }
    }
    .block-lline {
      border-bottom: 1px solid #dcdfe6;
    }
    .block-title {
      padding: 0 10px;
      line-height: 16px;
      color: #303133;
      font-weight: 500;
      height: 16px;
      border-left: 6px solid #47a87d;
    }
    .remarkC {
      margin-top: 20px;
    }
    .block-title-subtitle {
      margin-top: 20px;
      padding: 0 10px;
      color: #303133;
      .cirl {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #47a87d;
        vertical-align: middle;
      }
      padding: 0 10px;
    }
    .block-content {
      padding-top: 20px;
      padding-bottom: 0;
      .block-item {
        display: flex;
        flex-wrap: wrap;
        /deep/.el-form-item__content {
          .is-disabled {
            .el-input__inner {
              background: #e4e7ed;
            }
          }
        }
        .isreveal-detail {
          .el-radio-group {
            min-width: 178px;
          }
        }
      }
      .item-list {
        width: 33%;
        .unit {
          position: absolute;
          right: 10px;
          color: #909399;
        }
      }
      .pressure-spot{
        // display: flex;
        .required-icon{
          color: red;
        }
        .pressure-spot-unit{
          right: 5px;
        }
        .pressure-spot-content{
              display: flex;
          margin-left: 140px;
          line-height: 40px;
          position: relative;
          font-size: 14px;
         /deep/.el-input__inner{
           padding-left: 10px;
           padding-right: 32px;
         }
        }
        .spot-label{
          width: 140px;
              text-align: right;
          vertical-align: middle;
          float: left;
          font-size: 14px;
          color: #606266;
          line-height: 40px;
          padding: 0 12px 0 0;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
        }
        .split-spot{
          line-height: 36px;
          font-size: 24px;
          margin: 0 2px;
        }
        /deep/.el-form-item__label:before{
            content:'';
            margin-right:0
            
          }
        .second-spot{

          
        }
      }
      .outstandingClearS {
        /deep/.el-input {
        }
        /deep/.el-input-number{
            width: 72%;
            .el-input__inner{
                  border-right: none;
                  border-radius: 3px 0 0 3px;
                  line-height: 40px;
                  height: 39px;
            }
        }
        /deep/.el-select {
          width: 28%;
          .el-input__inner {
            padding: 0 10px;
            border: 1px solid #dcdfe6;
            border-left: none;
            height: 39px;
            line-height: 40px;
          }
        }
      }
      .agreement-type {
        margin-left: 62px;
      }
    }
    .upload-list {
      width: 40%;
      padding: 20px;
      .uploadBtn {
        background: #47a87d;
        border-radius: 20px;
        margin: 10px;
        border: none;
      }
    }
  }
}
</style>
